export interface IUserRegister {
  displayName: string;
  username: string;
  password: string;
}

export interface IResponse {
  status?: number;
  success?: boolean;
  message?: string;
  data?: object;
}

export interface IUserLogin {
  username: string;
  password: string;
}

export interface Authorities {
  authority: string;
}

export interface AuthenticatedUser {
    displayName: string;
    username: string;
    authorities: Authorities[];
    role: string;
}

export interface AuthenticationResponse {
  token: string;
  user: AuthenticatedUser;
}

export interface ICategory {
  id?: number;
  name: string;
}


export interface IProduct {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: ICategory;
  imageName?: string;
  contentType?: string;
  imageUrl?: string;
}
export interface IAddress {
    id?: number;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface IPaymentMethod {
    id: number;
  type: string;
  details: string;
}

export interface IOrderItem {
    productId: number;
    productName: string;
    quantity: number;
    price: number; 
    imageUrl?: string; 
}




export interface IOrderItem {
    productId: number;
    quantity: number;
    price: number; 
    productName: string; 
    productImageUrl?: string; 
}


export interface IOrder {
    id?: number;
    userId?: number; 
    orderDate: string;
    totalAmount: number;
    status: string;
    items: IOrderItem[];
    shippingAddress: IAddress;
    paymentMethod: IPaymentMethod;
}

export interface IOrderDocument {
    id: number;
    orderId: number;
    originalFilename: string;
    contentType: string;
    size: number;
    uploadDate: string;
}
