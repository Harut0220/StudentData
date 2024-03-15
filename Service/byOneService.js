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
      // await useDatabaseCompanyDB()
      // const resdb=await executeQuery('SELECT * FROM company_links;')
      // .then((results) => {
      //   return results;
      // })
      // .catch((err) => {
      //   console.error(err);
      // });

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
        const $2 = cheerio.load(".web_link");
        const webLink = $2(".web_link");
        const text = webLink.css("content");
        const nameByAddressArrayOne=[]
        const nameByAddress=$(".col-12>.contacts_list>.branch_block>.contact_subtitle").each((index,element)=>{
            const nameByadd=$(element).text()
            if (nameByadd && nameByadd.trim() !== "") {
                nameByAddressArrayOne.push(nameByadd)
            }
        })
        
        console.log("hat",nameByAddressArrayOne);
        // const web = $(".contact_subblock>.web_link").each((index, element) => {
        //   const link = $(element).attr("href");

        //   if (link && link.trim() !== "") {
        //     if (index === 2) {
        //       webLink.push(link);
        //     }

        //     //   return link
        //   }
        // });
        const lat = $("#map_canvas").attr("lat");
        const lon = $("#map_canvas").attr("lon");
        const activArray = [];
        if (activity[activity.length - 1]) {
          activArray.push(activity[activity.length - 1]);
          if (activity[activity.length - 2]) {
            activArray.push(activity[activity.length - 2]);
            if (activity[activity.length - 3]) {
              activArray.push(activity[activity.length - 3]);
            }
          }
        }

        const phoneArray = [];
        
        const addresArray = [];
        let index = 0;
        for await (const adrres of address) {
          if (address[index]) {
            addresArray.push(adrres);
          } else {
            addresArray.push(" ");
          }

          if (phone[index]) {
            phoneArray.push(phone[index]);
          } else {
            phoneArray.push(" ");
          }

        //   console.log("Index:", adrres);
          index++;
        }
        const mapArray=[]
        const maplatlon=[]
        // await useDatabase();
        // await storeQrToDB(name, address, phone, category, lat, lon);
        if ($("#map_canvas").attr("lat") && $("#map_canvas").attr("lon")) {
            maplatlon.push([lat,lon])
            mapArray.push({nameByAddressArrayOne,maplatlon})
          resultArray.push({
            name,
            address: addresArray,
            phone,
            activity: activArray,
            text,
            map:mapArray
          });
        }
      }

      return resultArray;
    } catch (error) {
      console.error(error);
    }
  },
};

export default byOneService;
