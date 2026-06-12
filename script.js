let keranjang = [];

/* JAM REALTIME */
function updateDateTime(){
    const now = new Date();

    document.getElementById("datetime").innerHTML =
        now.toLocaleDateString("id-ID", {
            weekday:"long",
            year:"numeric",
            month:"long",
            day:"numeric"
        }) + " | " + now.toLocaleTimeString("id-ID");
}

setInterval(updateDateTime,1000);
updateDateTime();

/* FORMAT RUPIAH */
function formatRupiah(num){
    return num.toLocaleString("id-ID");
}

/* TAMBAH BARANG */
function tambahBarang(){

    let nama = document.getElementById("namaBarang").value;
    let harga = parseInt(document.getElementById("hargaBarang").value);
    let qty = parseInt(document.getElementById("qtyBarang").value);

    if(!nama || harga <= 0 || qty <= 0){
        alert("Isi data dengan benar!");
        return;
    }

    keranjang.push({nama,harga,qty});

    document.getElementById("namaBarang").value="";
    document.getElementById("hargaBarang").value="";
    document.getElementById("qtyBarang").value="";

    render();
}

/* RENDER */
function render(){

    let tbody = document.getElementById("cartBody");
    tbody.innerHTML="";

    let total = 0;

    keranjang.forEach((item,i)=>{
        let sub = item.harga * item.qty;
        total += sub;

        tbody.innerHTML += `
        <tr>
            <td>${item.nama}</td>
            <td>${item.qty}</td>
            <td>Rp ${formatRupiah(item.harga)}</td>
            <td>Rp ${formatRupiah(sub)}</td>
            <td>
                <button class="btn-delete" onclick="hapus(${i})">X</button>
            </td>
        </tr>`;
    });

    document.getElementById("totalBelanja").innerText =
        formatRupiah(total);

    hitungKembalian();
}

/* HAPUS */
function hapus(i){
    keranjang.splice(i,1);
    render();
}

/* KEMBALIAN */
function hitungKembalian(){

    let total = keranjang.reduce((a,b)=>a+(b.harga*b.qty),0);
    let bayar = parseInt(document.getElementById("uangDibayar").value) || 0;

    let kembali = bayar - total;

    document.getElementById("uangKembalian").value =
        "Rp " + formatRupiah(kembali > 0 ? kembali : 0);
}

/* CETAK STRUK */
function selesaiDanCetak(){

    if(keranjang.length === 0){
        alert("Keranjang kosong!");
        return;
    }

    let total = keranjang.reduce((a,b)=>a+(b.harga*b.qty),0);
    let bayar = parseInt(document.getElementById("uangDibayar").value) || 0;

    if(bayar < total){
        alert("Uang kurang!");
        return;
    }

    let kembali = bayar - total;

    let waktu = new Date();

    let noTransaksi =
        "ADMN" +
        Date.now().toString().slice(-8);

    let namaKasir = 
        document.getElementById("namaKasir").value;

    let daftar = "";

    keranjang.forEach(item=>{
        daftar += `
        <tr>
            <td>${item.nama}</td>
            <td>${item.qty}</td>
            <td>Rp ${formatRupiah(item.harga * item.qty)}</td>
        </tr>`;
    });

    const struk = `
    <html>
    <head>
    <style>
        body{
            font-family:monospace;
            font-size:13px;
            padding:15px;
            text-transform:uppercase;
        }

        h2{
            text-align:center;
            margin-bottom:5px;
        }

        .alamat{
            text-align:center;
            font-size:11px;
            margin-bottom:25px;
        }

        .info{
            text-align:left;
            margin-bottom:25px;
            line-height:1.5;
        }

        table{
            width:100%;
            border-collapse:collapse;
            text-align:center;
        }

        td,th{
            padding:5px;
            border-bottom:1px dashed #999;
            text-align:center;
        }

        .spacer{
            height:25px;
        }

        .total{
            margin-top:20px;
            font-weight:bold;
            text-align:right;
        }
    </style>
    </head>

    <body>

        <h2>TOKO KHOZ</h2>

        <div class="alamat">
            Jl. Jatiwayang<br>
            Ngunut, Tulungagung, Jawa Timur<br>
        </div>

       <div class="info">
            NO TRANSAKSI : ${noTransaksi}<br>
            KASIR        : ${namaKasir}<br>
            TANGGAL      : ${waktu.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            })}<br>
            JAM          : ${waktu.toLocaleTimeString("id-ID")}
        </div>

        <hr>

        <table>
            <tr>
                <th>Barang</th>
                <th>Qty</th>
                <th>Total</th>
            </tr>

            ${daftar}
        </table>

        <div class="spacer"></div>

        <hr>

        <div class="total">
            <p>Total    : Rp ${formatRupiah(total)}</p>
            <p>Bayar    : Rp ${formatRupiah(bayar)}</p>
            <p>Kembali  : Rp ${formatRupiah(kembali)}</p>
        </div>

        <hr>

        <center>Terima Kasih, Selamat Belanja Kembali</center>

    </body>
    </html>
    `;

    let win = window.open("", "", "width=400,height=700");
    win.document.write(struk);
    win.document.close();
    win.print();

    keranjang = [];
    render();

    document.getElementById("uangDibayar").value="";
    document.getElementById("uangKembalian").value="";
}