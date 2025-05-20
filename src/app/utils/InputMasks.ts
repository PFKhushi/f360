
export function maskDate(value: string): string {
  const cleaned = value.replace(/\D/g, "");
  const day = cleaned.slice(0, 2);
  const month = cleaned.slice(2, 4);
  const year = cleaned.slice(4, 8);
  
  let masked = day;
  if (month) masked += "/" + month;
  if (year) masked += "/" + year;
  
  return masked;
}

export function maskCPF(value: string | undefined): string {

  if(value){
    const cleaned = value.replace(/\D/g, "");
    const part1 = cleaned.slice(0, 3);
    const part2 = cleaned.slice(3, 6);
    const part3 = cleaned.slice(6, 9);
    const part4 = cleaned.slice(9, 11);

    let masked = part1;
    if (part2) masked += "." + part2;
    if (part3) masked += "." + part3;
    if (part4) masked += "-" + part4;

    return masked;
  }
  return ''
}

export function maskCNPJ(value: string | undefined): string {
  if (value) {
    const cleaned = value.replace(/\D/g, '');
    const part1 = cleaned.slice(0, 2);
    const part2 = cleaned.slice(2, 5);
    const part3 = cleaned.slice(5, 8);
    const part4 = cleaned.slice(8, 12);
    const part5 = cleaned.slice(12, 14);

    let masked = part1;
    if (part2) masked += '.' + part2;
    if (part3) masked += '.' + part3;
    if (part4) masked += '/' + part4;
    if (part5) masked += '-' + part5;

    return masked;
  }
  return '';
}

export function maskTime(value: string): string {
  const cleaned = value.replace(/\D/g, "");
  const hours = cleaned.slice(0, 2);
  const minutes = cleaned.slice(2, 4);

  let masked = hours;
  if (minutes) masked += ":" + minutes;

  return masked;
}

export function maskPhone(value: string | undefined): string {
  if (value) {
    const cleaned = value.replace(/\D/g, '');
    const part1 = cleaned.slice(0, 2);
    const part2 = cleaned.slice(2, 7);
    const part3 = cleaned.slice(7, 11);

    let masked = '';
    if (part1) masked += `(${part1}`;
    if (part2) masked += `) ${part2}`;
    if (part3) masked += `-${part3}`;

    return masked;
  }
  return '';
}

export function maskRGM(value: string | undefined): string {
  if (value) {
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 8);
    return limited;
  }
  return '';
}

export function cleanMasksNumeralDocuments(value: string){
  return value.replace(/\D/g, '')
}