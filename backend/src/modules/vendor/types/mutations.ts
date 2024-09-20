export interface CreateVendorDTO {
  name: string;
  handle: string;
  address: string;
  phone: string;
  email: string;
  image_url?: string;
  is_open?: boolean;
}

export interface UpdateVendorsDTO extends Partial<CreateVendorDTO> {
  id: string;
}

export interface CreateVendorAdminDTO {
  email: string;
  first_name: string;
  last_name: string;
  vendor_id: string;
}

export interface UpdateVendorAdminsDTO extends Partial<CreateVendorAdminDTO> {
  id: string;
}

export interface CreateAdminInviteDTO {
  venadm_id: string;
  role?: string | null;
  email?: string;
}
