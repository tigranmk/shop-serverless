import { middyfy } from '@libs/lambda';
import { raspberryPiModels } from '../../products';
import { prepareResponse } from '@libs/formats';

const getProductsById = async (event) => {
  const requestOrigin = event.headers.origin || '';
  const productId = event.pathParameters.productId;

  const product = raspberryPiModels.find(({id}) => id === Number(productId));
  if (!product) {
    return prepareResponse(404, requestOrigin, { error: 'Product not found'});
  }
    return prepareResponse(200, requestOrigin, { product });
}
export default getProductsById;
export const main = middyfy(getProductsById);
