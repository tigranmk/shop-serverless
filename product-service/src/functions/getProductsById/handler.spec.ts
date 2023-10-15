import getProductsById from './handler';
import { prepareResponse } from '@libs/formats';


jest.mock('@libs/lambda');
describe('getProductsById', () => {
  it('should return a product when a valid productId is provided', async () => {
    const productId = '1';
    const event = {
      headers: {
        origin: 'localhost',
      },
      pathParameters: {
        productId,
      },
    };

    const product = {product:{ id:1, price:35.99, name:"Raspberry Pi 4 Model B" }};

    const response = await getProductsById(event);

    expect(response).toEqual(
      prepareResponse(200, 'localhost', { ...product })
    );
  });

  it('should return a 404 error when an invalid productId is provided', async () => {
    const productId = 'invalidProductId';
    const event = {
      headers: {
        origin: 'localhost',
      },
      pathParameters: {
        productId,
      },
    };

    const response = await getProductsById(event);
    expect(response).toEqual(
      prepareResponse(404, 'localhost', { error: 'Product not found' })
    );
  });
});
