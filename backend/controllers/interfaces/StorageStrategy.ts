export interface FileDetails{
  ref_dir: string,
  fileName: string,
  ref_ext: string,
  metadata: Object|null
}

export interface StorageStrategy{
  uploadBlob(details: FileDetails, blob: any): Boolean;
  deleteRef(details: FileDetails)
  getBlob(details: FileDetails);
}
