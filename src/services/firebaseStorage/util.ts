const validExtensions = [
  '.png',
  '.jpg',
  '.jpeg'
]

export class FileNameUtil {
  pcId: string;
  
  constructor(pcId: string) {
    this.pcId = pcId;
  }

  generateUniqueFileName(fileName: string) {
    return `${this.pcId}_${fileName}`;
  }

  generateIncrementedFileName(uniqueFileName: string) {
    let index = -2;
    for (const e of validExtensions) {
        index = uniqueFileName.indexOf(e);
        if (index > -1) break;
    }
    if (index < 0) {
        return uniqueFileName + '_(1)';
    } else {
        return uniqueFileName.substring(0, index) + '_(1)' + uniqueFileName.substring(index);
    }
  }

  generateFileNameCheckDuplicates(fileName: string,  includePcId: boolean, existingFileName?: string): string {
    const baseFileName = includePcId ? this.generateUniqueFileName(fileName) : fileName;
    
    if (existingFileName && fileName === existingFileName) {
      return this.generateIncrementedFileName(baseFileName);
    } else {
      return baseFileName;
    }
  }

  transformUniqueToGenericFileName(uniqueFileName: string) {
    return uniqueFileName.split(`${this.pcId}_`)[1];
  }
}