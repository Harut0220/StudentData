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

//level three

export const useCompanys=async ()=>{
  try {
    const results = await pool.query(`USE companys;`);
  } catch (error) {
    console.error(error)
  }
} 


export const tableCompany=async ()=>{
  try {
    const results = await pool.query(`CREATE TABLE organization (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(1000) ,
      webLink VARCHAR(255)
  );`);
  } catch (error) {
    console.error(error)
  }
}

export const addTableOrganization=async (name,webLink)=>{
  try {
    const results = await pool.query(
      `INSERT INTO organization(name,webLink) VALUES('${name}','${webLink}')`
    );
  } catch (error) {
    console.error(error)
  }
}

export const organizationTableId=async()=>{
  try {
   
    const result=await pool.query(`SELECT * FROM organization;`)
    return result
  } catch (error) {
    console.error(error)
  }
}

export const tableCompanyActivity=async ()=>{
  try {
    const result=await pool.query(
      `CREATE TABLE activity (
        id INT AUTO_INCREMENT PRIMARY KEY,
        organization_id INT,
        activity_name varchar(1000)
    );`
    )
  } catch (error) {
    console.error(error)
  }
} 

export const addTableActivity=async (organization_id,activity_name)=>{
  try {
    const results = await pool.query(
      `INSERT INTO activity(organization_id,activity_name) VALUES('${organization_id}','${activity_name}')`
    );
  } catch (error) {
    console.error(error)
  }
}


export const activityTableId=async()=>{
  try {
    const result=await pool.query(`SELECT * FROM activity;`)
    return result
  } catch (error) {
    console.error(error)
  }
}



export const tableCompanyBranches=async()=>{
  try {
    const results = await pool.query(`CREATE TABLE branch (
      id INT AUTO_INCREMENT PRIMARY KEY,
      organization_id INT,
      telephone VARCHAR(1000),
      address VARCHAR(1000),
      latitude DECIMAL(10, 8),
      longitude DECIMAL(11, 8),
      title varchar(255)
  );`);
  } catch (error) {
    console.error(error)
  }
}

export const addTableBranch=async (organization_id,telephone,address,latitude,longitude,title)=>{
  try {
    const results = await pool.query(
      `INSERT INTO branch(organization_id,telephone,address,latitude,longitude,title) VALUES('${organization_id}','${telephone}','${address}','${latitude}','${longitude}','${title}')`
    );
  } catch (error) {
    console.error(error)
  }
}



export const getLinksCompany=async()=>{
  try {
    const results = await pool.query(`SELECT * FROM branch;`);
    return results
  } catch (error) {
    console.error(error)
  }
}
//level three















// CREATE TABLE organization (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   name VARCHAR(255) NOT NULL,
//   webLink VARCHAR(255)
// );

// CREATE TABLE activity (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   name VARCHAR(255) NOT NULL
// );

// CREATE TABLE organization_activity (
//   organization_id INT,
//   activity_id INT,
//   PRIMARY KEY (organization_id, activity_id),
//   FOREIGN KEY (organization_id) REFERENCES organization(id),
//   FOREIGN KEY (activity_id) REFERENCES activity(id)
// );
