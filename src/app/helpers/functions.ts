export function formatDate(date: string) {
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const year = date.substring(0, 4);
    const month = monthNames[parseInt(date.substring(5, 7)) - 1];
    const day = date.substring(8, 10);
    return `${day} ${month} ${year}`;
}