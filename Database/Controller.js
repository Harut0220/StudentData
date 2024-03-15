import connection from "./Pool.js";

export const pool = await connection();


export const getComanysLinks=async()=>{
  try {
    const results = await pool.query(`SELECT * FROM company_links;`);
  } catch (error) {
    console.error(error);
  }
}


export const useDatabase = async () => {
  try {
     const results = await pool.query(`USE spyur;`);
  } catch (error) {
    console.error(error)
  }
 
};

export const useDatabaseCompanyDB = async () => {
  try {
    console.log("use exav company vra");
    const results = await pool.query(`USE spyurcompany;`);  
  } catch (error) {
    console.error(error)
  }
  
};

export const createTable = async () => {
  try {
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
  } catch (error) {
    console.error(error)
  }
  
};

export const createTableByPagesLinks = async () => {
  try {
     const results = await pool.query(
    `CREATE TABLE page_links(
        id int AUTO_INCREMENT,
        pageLink varchar(200) NOT NULL,
        PRIMARY KEY (id)
    )`
  );
  } catch (error) {
    console.error(error)
  }
 
};

export const addLinks = async (linksByAllPages) => {
  try {
    linksByAllPages.map(async (el) => {
    const results = await pool.query(
      `INSERT INTO page_links(pageLink) VALUES('${el}')`
    );
  });
  } catch (error) {
    console.error(error)
  }
  
};

export const addCompanyLinks = async (linksArray) => {
  try {
    for await (const link of linksArray) {
      console.log("mtav db company linker@");
      const results = await pool.query(
        `INSERT INTO company_links(company_link) VALUES('${link}')`
      );
    }  
  } catch (error) {
    console.error(error)
  }
};

export const storeQrToDB = async (
  nameCompany,
  address,
  phone,
  category,
  lat,
  lon
) => {
  try {
    const results = await pool.query(
      `INSERT INTO spyur_data(nameCompany,address,phone,category,lat,lon) VALUES('${nameCompany}','${address}','${phone}','${category}','${lat}','${lon}')`
    );
  } catch (error) {
    console.error(error)
  }
  // console.log("storeQrToDB --> qr, uniqueId =====> ", qr_path, unique_token);
};

export const getLinksPagesDb = async () => {
  try {
     const results = await pool.query(`SELECT * FROM spyur_data;`);
  } catch (error) {
    console.error(error)
  }
 
};
