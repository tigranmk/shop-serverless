import { middyfy } from '@libs/lambda';
import { raspberryPiModels } from '../../products';
import { prepareResponse } from '@libs/formats';


const getProducts = async (event) => {
  const requestOrigin = event.headers.origin || '';
  if (raspberryPiModels.length === 0) {
    return prepareResponse(200, requestOrigin, { error: 'Products not found' })
  }
  return prepareResponse(200, requestOrigin, { raspberryPiModels });
};

export default getProducts;
export const main = middyfy(getProducts);
