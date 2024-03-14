import connection from "./Pool.js";

export const pool = await connection();

export const useDatabase = async () => {
    const results = await pool.query(`USE spyur;`);
  };

export const createTable = async () => {
    const results = await pool.query(
      `CREATE TABLE spyur_data(
        id int AUTO_INCREMENT,
        nameCompany varchar(200) NOT NULL,
        address varchar(200) NOT NULL,
        phone varchar(50) NOT NULL,
        category varchar(3000) NOT NULL,
        lat int NOT NULL,
        lon int NOT NULL,
        PRIMARY KEY (id)
    )`
    );
  };

  export const createTableByPagesLinks=async ()=>{
    const results = await pool.query(
      `CREATE TABLE page_links(
        id int AUTO_INCREMENT,
        pageLink varchar(200) NOT NULL,
        PRIMARY KEY (id)
    )`
    );
  }

  export const addLinks=async(linksByAllPages)=>{
    linksByAllPages.map(async(el)=>{
      const results = await pool.query(
      `INSERT INTO page_links(pageLink) VALUES('${el}')`
    );
    })
    
  }
  
  export const storeQrToDB = async (nameCompany,address,phone,category,lat,lon) => {
    // console.log("storeQrToDB --> qr, uniqueId =====> ", qr_path, unique_token);
    const results = await pool.query(
      `INSERT INTO spyur_data(nameCompany,address,phone,category,lat,lon) VALUES('${nameCompany}','${address}','${phone}','${category}','${lat}','${lon}')`
    );
  };

  export const getLinksPagesDb=async()=>{
    const results = await pool.query(
      `SELECT * FROM spyur_data;`
    )
  }
