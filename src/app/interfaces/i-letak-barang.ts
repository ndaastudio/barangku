export interface IGambarLetakBarang {
    id: number,
    id_letak_barang: number,
    gambar: string,
    url: string,
}

export interface ILetakBarang {
    id: number,
    nama_barang: string,
    kategori: string,
    kategori_lainnya: string,
    jumlah_barang: string,
    letak_barang: string,
}
