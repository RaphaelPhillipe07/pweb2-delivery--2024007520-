export function formatarData(valor) {
  if (!valor) return '';
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return valor;
  return data.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  });
}

export const STATUS_ENTREGA = ['CRIADA', 'EM_TRANSITO', 'ENTREGUE', 'CANCELADA'];

export function rotuloStatus(status) {
  return (status || '').replace(/_/g, ' ');
}
