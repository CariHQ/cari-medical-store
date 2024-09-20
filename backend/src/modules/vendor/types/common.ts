import { ProductDTO } from "@medusajs/types";
import VendorModuleService from "../service";
export interface VendorDTO {
  id: string;
  handle: string;
  is_open: boolean;
  name: string;
  description?: string;
  address: string;
  phone: string;
  email: string;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
  products?: ProductDTO[];
}
export interface VendorAdminDTO {
  id: string;
  vendor: VendorDTO;
  first_name: string;
  last_name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}
export interface VendorProductDTO {
  vendor_id: string;
  product_id: string;
}
declare module "@medusajs/types" {
  export interface ModuleImplementations {
    vendorModuleService: VendorModuleService;
  }
}
