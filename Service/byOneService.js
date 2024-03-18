import { activityTableId, addTableActivity, addTableBranch, addTableOrganization, getLinksCompany, organizationTableId, tableCompany, useCompanys, useDatabaseCompanyDB } from "../Database/Controller.js";
// import { executeQuery } from "./companyService.js";
import mysql from "mysql2";
import cheerio, { html } from "cheerio";
import fetch from "node-fetch";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "companys",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Function to execute a query and return a promise
export function executeQuery(query) {
  return new Promise((resolve, reject) => {
    pool.query(query, (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

const byOneService = {
  getByOne: async () => {
    try {






      const linksArray = [
        "/am/companies/a1-project-company/43238/",
        "/am/companies/ham-tea-production-company/84050",
      ];
      const resultArray = [];
      let count=0;
      for await (const link of linksArray) {
        const resultByComanyName = await fetch(`https://www.spyur.am${link}`);
        const html = await resultByComanyName.text();
        const $ = cheerio.load(html);
        const activArray=[]
        const activity = $(".multilevel_list>li>ul>li>ul>li>a")
          .map((index, element) => $(element).text())
          .get();
          if (activity[activity.length-1]) {
            activArray.push(activity[activity.length-1])
          }
          if(activity[activity.length-2]){
            activArray.push(activity[activity.length-2])
          }
          
          
       
        const name = $("h1").text();
        const address = $(".address_block")
          .map((index, element) => $(element).text())
          .get();
        const phone = $(".phone_info")
          .map((index, element) => $(element).text())
          .get();
         
          const titleGet=$(".contacts_list>.branch_block>.contact_subtitle").map((index,element)=>{
            return $(element).text()
          }).get()
          
       

        const webLink=$(".web_link").attr("href")
       
        
        const nameByAddressArrayOne = [];

        const branchObjArray = [];
        const resArr = [];
        const resObj = {
          name,
          
        };
        if(webLink[8]!=="s"){
          resObj.webLink=webLink
        }else{
          resObj.webLink=null
        }
        const nameByAddress = $(
          ".map_ico"
        )
          .each(async (index, element) => {
            const lat = $(element).attr("lat");
            const lon =$(element).attr("lon")
          
            
const branchObj = { };
            if (lat && lat.trim() !== "") {
              
            }
                  
                  
            
             
                  
                 
                  if(phone[index]){
                    branchObj.telephone=phone[index]
                  }else{
                    branchObj.telephone=null
                  }
                  if (address[index]) {
                    branchObj.adres=address[index]
                  }else{
                    branchObj.adres=null
                  }
                  if(lat){
                      branchObj.latitud=lat
                  }else{
                      branchObj.latitud=null
                  }
                  if (lon) {
                    branchObj.longitud=lon
                  }else{
                    branchObj.longitud=null
                  }
                  if(lat){
                    branchObj.title=titleGet[index]
                  }else{
                    branchObj.title=null
                  }
                  
                    // branchObj.lat = $(element[index]).attr("lat");
                    branchObjArray.push(branchObj);
                    
                    resObj.activity = activArray;
                    resObj.branches = branchObjArray;
                    resArr.push(resObj);
                 
                

              
            
              
            
            
          })
          .get();
          if(resObj.branches)
        resultArray.push(resObj);
      }
      await useCompanys()


      //add DB
    //  for await (const organization of resultArray){
    //   await addTableOrganization(organization.name,organization.webLink)

       

    //  }
    //     const resGlobObj=await organizationTableId()
    //    for await (const globObjItems of resGlobObj[0]){
    //    const findRes= resultArray.find((el)=>el.name===globObjItems.name)
      
    //    for await (const activ of findRes.activity){
    //     await addTableActivity(globObjItems.id,activ)
    //    }
        
    //     for await (const branch of findRes.branches){
         
    //       await addTableBranch(globObjItems.id,branch.telephone,branch.adres,branch.latitud,branch.longitud,branch.title)
          
    //     }
        
    //    }
       //add DB


       const resultActivityTable=await organizationTableId()
      console.log(resultActivityTable);
    
      return resultArray;
    } catch (error) {
      console.error(error);
    }
  },
};

export default byOneService;
