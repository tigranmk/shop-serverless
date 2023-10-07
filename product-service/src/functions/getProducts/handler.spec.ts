import getProducts from '@functions/getProducts/handler';
import { prepareResponse } from '@libs/formats';
import { raspberryPiModels } from '../../products';

jest.mock('@libs/lambda');

describe('getProducts', () => {
  it('should return a 200 response with the list of products when products are available', async () => {
    const event = {
      headers: {
        origin: 'localhost',
      },
    };

    const expectedResponse = prepareResponse(200, 'localhost', {
      raspberryPiModels: raspberryPiModels,
    });

    const response = await getProducts(event);

    expect(response).toEqual(expectedResponse);
  });
});
