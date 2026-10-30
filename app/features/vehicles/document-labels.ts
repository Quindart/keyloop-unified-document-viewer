const documentTypeTranslationKeys: Record<string, string> = {
  contract: 'documents.typeContract',
  receipt: 'documents.typeReceipt',
  invoice: 'documents.typeInvoice',
  inspection: 'documents.typeInspection',
  repair: 'documents.typeRepair',
  maintenance: 'documents.typeMaintenance',
};

export function getDocumentTypeTranslationKey(type: string) {
  return documentTypeTranslationKeys[type.toLowerCase()];
}
