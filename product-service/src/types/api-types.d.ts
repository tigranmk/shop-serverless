interface GetProductsByIdRequest {
  pathParameters: {
    productId: string;
  };
  headers: {
    [header: string]: string;
  };
}

interface GetProductsRequest {
  headers: {
    [header: string]: string;
  };
}

interface ApiResponse<T> {
  statusCode: number;
  body: string;
  headers?: {
    [header: string]: string;
  };
}

type GetProductsByIdResponse = ApiResponse<Product>;

type GetProductsResponse = ApiResponse<Product[]>;

interface Product {
  id: string;
  name: string;
  price: number;
}

export {
  GetProductsByIdRequest,
  GetProductsRequest,
  GetProductsByIdResponse,
  GetProductsResponse,
};
