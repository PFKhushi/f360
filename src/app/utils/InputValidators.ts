
export function isValidCpfFormat(cpf: string){
  return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)
}

export function isValidCnpjFormat(cnpj: string): boolean {
  return /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(cnpj);
}

export function isValidPhoneFormat(phone: string | undefined) {
  return /^\(\d{2}\) \d{5}-\d{4}$/.test(phone || '');
}

export function isValidRGMFormat(value: string | undefined) {
  return /^\d{8}$/.test(value || '');
}

export function isValidTimeFormat(time: string){ 
  return /^\d{2}:\d{2}$/.test(time)
}

export function isValidTimeRange(time: string){
  const [hours, minutes] = time.split(":").map(Number);
  return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
}

export function isValidDateFormat(date: string){
  return /^\d{2}\/\d{2}\/\d{4}$/.test(date)
}

export function isValidDateRange(date: string){
  const [day, month, year] = date.split("/").map(Number);
  const parsedDate = new Date(year, month - 1, day);
  return (
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day
  );
}