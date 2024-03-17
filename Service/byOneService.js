import { useDatabaseCompanyDB } from "../Database/Controller.js";
// import { executeQuery } from "./companyService.js";
import mysql from "mysql2";
import cheerio, { html } from "cheerio";
import fetch from "node-fetch";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "H20021996",
  database: "spyurcompany",
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
        "/am/companies/heqiatneri-ashkharh-event-planning-company/49361",
        "/am/companies/ham-tea-production-company/84050",
      ];
      const resultArray = [];

      for await (const link of linksArray) {
        const resultByComanyName = await fetch(`https://www.spyur.am${link}`);
        const html = await resultByComanyName.text();
        const $ = cheerio.load(html);

        const activity = $(".multilevel_list>li>ul>li>ul>li>a")
          .map((index, element) => $(element).text())
          .get();
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
          console.log(titleGet);
        // const lat = $(".map_ico").attr("lat");
        // const lon = $(".map_ico").attr("lon");

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
            // console.log(nameByadd);
            
const branchObj = { };
            if (lat && lat.trim() !== "") {
              
            }
                  
                  
              if(lat){
                branchObj.title=titleGet[index]
              }else{
                branchObj.title=null
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
                  
                    branchObj.lat = $(element[index]).attr("lat");
                    branchObjArray.push(branchObj);
                    
                    resObj.activity = activity;
                    resObj.branches = branchObjArray;
                    resArr.push(resObj);
                 
                

              
            
            resultArray.push(resObj);
          })
          .get();
        
      }

      return resultArray;
    } catch (error) {
      console.error(error);
    }
  },
};

export default byOneService;
