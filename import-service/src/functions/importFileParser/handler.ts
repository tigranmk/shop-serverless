import { S3Client, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { S3Event } from "aws-lambda";
import csvParser from 'csv-parser';
import { RESPONSE_STATUS_CODES } from "@utils/constants";
import { ERR_MSGS } from "@utils/messages";
import { Readable } from "stream";

const { BUCKET_REGION } = process.env;

const copyCommand = async (client, record) => {
  const copyFile = new CopyObjectCommand({
    Bucket: 'bucket-for-uploading-files',
    CopySource: `bucket-for-uploading-files/${record.s3.object.key}`,
    Key: record.s3.object.key.replace('uploaded', 'parsed')
  })

  await client.send(copyFile);
  console.log('importFileParser moved csv to parsed location');
}

const deleteCommand = async (client, record) => {

  const deleteFile = new DeleteObjectCommand({
    Bucket: 'bucket-for-uploading-files',
    Key: record.s3.object.key
  })
  await client.send(deleteFile);
  console.log('importFileParser deleted from uploaded location');
}

const importFileParser = async (event: S3Event) => {
  try {
    const records = event.Records;
    const recordsLength = records.length;
    console.log('Import file parser lambda was triggered with records: ', records);

    if (recordsLength === 0) {
      throw new Error();
    }

    const s3Client = new S3Client({
      region: BUCKET_REGION,
    });

    const recordPromises = records.map(async (record, recordIndex) => {
      const RECORD_INFO = `[RECORD ${recordIndex + 1} of ${recordsLength}]`;
      const s3StreamBody = (
        await s3Client.send(
          new GetObjectCommand({
            Bucket: 'bucket-for-uploading-files',
            Key: record.s3.object.key
          })
        )
      ).Body;

      if (!(s3StreamBody instanceof Readable)) {
        throw new Error(`${RECORD_INFO} ${ERR_MSGS.MSG_ERROR_DURING_READ_STREAM}`);
      }

      return new Promise((resolve, reject) => {
        s3StreamBody
          .pipe(csvParser())
          .on('data', (data) => {
            console.log(RECORD_INFO, `Parsing product import CSV data: `, data);
          })
          .on('error', (error) => {
            console.error(RECORD_INFO, `Parsing error for product import CSV data: `, error);
            reject(new Error(`${RECORD_INFO} ${ERR_MSGS.MSG_ERROR_DURING_READ_STREAM}`));
          })
          .on('end', async () => {
            console.log(
              RECORD_INFO,
              `Product data parsed. Moving to "/parsed" folder has started.`
            );
            await Promise.all([copyCommand(s3Client, record), deleteCommand(s3Client, record)]);

            console.log(RECORD_INFO, 'Uploaded record deleted successfully!');
            resolve('ok')
          });

      })
    })

    await Promise.all(recordPromises);
    return {
      statusCode: RESPONSE_STATUS_CODES.ACCEPTED,
    };
  } catch (e) {
    return {
      messages: 'Internal server error.',
      err: e,
      statusCode: RESPONSE_STATUS_CODES.INTERNAL_ERROR,
    };
  }
};

export default importFileParser;
export const main = importFileParser;
