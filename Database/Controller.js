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

export const getCompanyLinks=async()=>{
  try {
    const result = await pool.query(`select * from company_links;`)
    return result
  } catch (error) {
    console.error(error)
  }
}

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
export const deleteDatabase=async ()=>{
  try {
    const result=await pool.query(`DROP DATABASE companys`)
  } catch (error) {
    console.error(error)
  }
}



export const createDatabase=async()=>{
  try {
    const result =await pool.query(`CREATE DATABASE companys`)
  } catch (error) {
    console.error(error)
  }
}

export const useCompanys=async ()=>{
  try {
    const results = await pool.query(`USE companys;`);
  } catch (error) {
    console.error(error)
  }
} 


export const tableOrganization=async ()=>{
  try {
    const results = await pool.query(`CREATE TABLE organization (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name_am VARCHAR(2000),
      name_en VARCHAR(2000),
      name_ru VARCHAR(2000),
      categore_id INT
  );`);
  } catch (error) {
    console.error(error)
  }
}

export const addTableOrganization=async (name_am,name_en,name_ru,categore_id)=>{
  try {
    const results = await pool.query(
      `INSERT INTO organization(name_am,name_en,name_ru,categore_id) VALUES("${name_am}","${name_en}","${name_ru}","${categore_id}");`
    );
  } catch (error) {
    console.error(error)
  }
}

export const getOrganizationTable=async()=>{
  try {
   
    const result=await pool.query(`SELECT * FROM organization;`)
    return result
  } catch (error) {
    console.error(error)
  }
}

export const tableWebLink=async()=>{
  try {
    const result = await pool.query(
      `CREATE TABLE weblink(
        id INT AUTO_INCREMENT PRIMARY KEY,
        organization_id INT,
        weblink_am VARCHAR(1000)
      );`
    )
  } catch (error) {
    console.error(error)
  }
}

export const addWebLink=async (organization_id,webLink)=>{
  try {
    const result =await pool.query(`INSERT INTO weblink(organization_id,weblink_am) VALUES('${organization_id}','${webLink}');`)
  } catch (error) {
    console.error(error)
  }
}

export const getWebLinkTable=async ()=>{
  try {
    const result =await pool.query(`select * from weblink;`)
    return result
  } catch (error) {
    console.error(error)
  }
}

export const tableCompanyActivity=async ()=>{
  try {
    const result=await pool.query(
      `CREATE TABLE subCategorys (
        id INT AUTO_INCREMENT PRIMARY KEY,
        subCategory_am varchar(1000),
        subCategory_en varchar(1000),
        subCategory_ru varchar(1000)
    );`
    )
  } catch (error) {
    console.error(error)
  }
} 

export const addTableActivity=async (activity_1_am,activity_1_en,activity_1_ru,activity_2_am,activity_2_en,activity_2_ru)=>{
  try {
    const results = await pool.query(
      `INSERT INTO subCategorys(subCategory_am,subCategory_en,subCategory_ru) VALUES("${activity_1_am}","${activity_1_en}","${activity_1_ru}")`
    );
  } catch (error) {
    console.error(error)
  }
}


export const getActivityTable=async()=>{
  try {
    const result=await pool.query(`SELECT * FROM subCategorys;`)
    return result
  } catch (error) {
    console.error(error)
  }
}



export const tableBranches=async()=>{
  try {
    const results = await pool.query(`CREATE TABLE branch (
      id INT AUTO_INCREMENT PRIMARY KEY,
      organization_id INT,
      telephone VARCHAR(1000),
      address_am VARCHAR(1000),
      address_en VARCHAR(1000),
      address_ru VARCHAR(1000),
      latitude DECIMAL(10, 8),
      longitude DECIMAL(11, 8),
      title_am varchar(255),
      title_en varchar(255),
      title_ru varchar(255)
  );`);
  } catch (error) {
    console.error(error)
  }
}

export const addTableBranch=async (organization_id,telephone,address_am,address_en,address_ru,latitude,longitude,title_am,title_en,title_ru)=>{
  try {
    const results = await pool.query(
      `INSERT INTO branch(organization_id,telephone,address_am,address_en,address_ru,latitude,longitude,title_am,title_en,title_ru) VALUES('${organization_id}','${telephone}','${address_am}','${address_en}','${address_ru}','${latitude}','${longitude}','${title_am}','${title_en}','${title_ru}')`
    );
  } catch (error) {
    console.error(error)
  }
}



export const getBranchTable=async()=>{
  try {
    const results = await pool.query(`SELECT * FROM branch;`);
    return results
  } catch (error) {
    console.error(error)
  }
}


// export const deleteOrganization=async ()=>{
//   try {
//     const results = await pool.query(`TRUNCATE organization;`);
//   } catch (error) {
//     console.error(error)
//   }
// }


// export const deleteActivity=async ()=>{
//   try {
//     const results = await pool.query(`TRUNCATE activity;`);
//   } catch (error) {
//     console.error(error)
//   }
// }

// export const deleteWebLink=async ()=>{
//   try {
//     const results = await pool.query(`TRUNCATE webLink;`);
//   } catch (error) {
//     console.error(error)
//   }
// }

// export const deleteBranchs=async ()=>{
//   try {
//     const results = await pool.query(`TRUNCATE branch;`);
//   } catch (error) {
//     console.error(error)
//   }
// }
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
