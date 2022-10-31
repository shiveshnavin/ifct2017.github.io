const ifct2017 = require('ifct2017');


async function main() {
    await ifct2017.compositions.load();
    /// Load corpus first


    var data;
    ifct2017.compositions('pineapple');
    data = ifct2017.compositions('food rich in α-Tocotrienol');
    // [ { code: 'E053',
    //     name: 'Pineapple',
    //     scie: 'Ananas comosus',
    //     lang: 'A. Ahnaros; B. Anarasa; G. Anenas; H. Ananas; Kan. Ananas; Kash. Punchitipul; Kh. Soh trun; Kon. Anas; Mal. Kayirha chakka; M. Kihom Ananas; O. Sapuri; P. Ananas; Tam. Annasi pazham; Tel. Anasa pandu; U. Ananas.',
    //     ... } ]

    ifct2017.columns('vitamin c');
    ifct2017.columns('c-vitamin');
    // [ { code: 'vitc',
    //     name: 'Total Ascorbic acid',
    //     tags: 'ascorbate water soluble vitamin c vitamin c essential' } ]

    ifct2017.pictures.unpkg('A001');
    // https://unpkg.com/@ifct2017/pictures/assets/A001.jpeg

    ifct2017.intakes('his');
    ifct2017.intakes('Histidine');

    console.log(data)
    // [ { code: 'his',
    //     whorda: -0.01,
    //     usear: NaN,
    //     usrdam: -0.014,
    //     usrdaf: NaN,
    //     euprim: NaN,
    //     euprif: NaN,
    //     ulus: NaN,
    //     uleu: NaN,
    //     uljapan: NaN } ]
    /// Negative value indicates amount per kg of body weight.
}
main();