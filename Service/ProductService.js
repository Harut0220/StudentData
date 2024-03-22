import cheerio, { html } from "cheerio";
import fetch from "node-fetch";
import axios from "axios";
import {
  addLinks,
  addTableActivity,
  addTableBranch,
  addTableOrganization,
  addWebLink,
  getLinksPagesDb,
  getOrganizationTable,
  storeQrToDB,
  useDatabase,
} from "../Database/Controller.js";
// import { each } from "cheerio/lib/api/traversing.js";
// import { slice } from "cheerio/lib/api/traversing.js";

const productService = {
  getCompanyNames: async (lang, page, letter) => {
    const linksArray = [];
    const resultArray=[]
    const fetchResult = await fetch(
      `https://www.spyur.am/${lang}/yellow_pages-${page}/alpha/${letter}/?from=home&tab=yello_p_am`
    );

    const html = await fetchResult.text();
    const $1 = cheerio.load(html);

    const links = $1(".results_list>a")
      .each((index, element) => {
        const link = $1(element).attr("href");
        linksArray.push(link);
      })
      .get();

    for await (const link of linksArray) {
      const fetchCompany = await fetch(`https://www.spyur.am${link}`);
      const html = await fetchCompany.text();
      const $ = cheerio.load(html);
      const activArray = [];
      const activity = $(".multilevel_list>li>ul>li>ul>li>a")
        .map((index, element) => $(element).text())
        .get();
      if (activity[activity.length - 1]) {
        activArray.push(activity[activity.length - 1]);
      }
      if (activity[activity.length - 2]) {
        activArray.push(activity[activity.length - 2]);
      }

      const status = $("#buffer50comment>span").text();
      const checker = "ՉԻ ԳՈՐԾՈՒՄ";
      //  if(!(status===checker)){

      const name = $("h1")
        .map((index, element) => {
          const res = $(element).text();

          return res;
        })
        .get();

      const address = $(".address_block")
        .map((index, element) => $(element).text())
        .get();
      const phone = $(".phone_info")
        .map((index, element) => $(element).text())
        .get();

      const titleGet = $(".contacts_list>.branch_block>.contact_subtitle")
        .map((index, element) => {
          return $(element).text();
        })
        .get();

      const webLink = $(".web_link").attr("href");

      const nameByAddressArrayOne = [];

      const branchObjArray = [];
      const resArr = [];

      const resObj = {};
      const searchRes = name[0].search('"');

      if (searchRes === -1) {
        resObj.name = name[0];
      } else {
        const resultArr = name[0].split('"');

        const oneArray = resultArr[0].split("");
        oneArray.push("'");
        const res = oneArray.join("");
        resultArr.shift();
        resultArr.unshift(res);

        const twoArray = resultArr[resultArr.length - 1].split("");
        twoArray.unshift("'");
        const resTwo = twoArray.join("");
        resultArr.pop();
        resultArr.push(resTwo);

        const resultName = resultArr.join("");
        console.log("mtnuma objecti mej", resultName);
        resObj.name = resultName[0];
      }

      if (webLink) {
        if (webLink.length > 8) {
          if (webLink[8] !== "s" && webLink[12] !== "s") {
            resObj.webLink = webLink;
          } else {
            resObj.webLink = null;
          }
        } else {
          resObj.webLink = null;
        }
      } else {
        resObj.webLink = null;
      }

      const nameByAddress = $(".map_ico")
        .each(async (index, element) => {
          const lat = $(element).attr("lat");
          const lon = $(element).attr("lon");

          const branchObj = {};

          if (phone[index]) {
            branchObj.telephone = phone[index];
          } else {
            branchObj.telephone = null;
          }
          if (address[index]) {
            branchObj.adres = address[index];
          } else {
            branchObj.adres = null;
          }
          if (lat) {
            branchObj.latitud = lat;
          } else {
            branchObj.latitud = null;
          }
          if (lon) {
            branchObj.longitud = lon;
          } else {
            branchObj.longitud = null;
          }
          if (lat) {
            branchObj.title = titleGet[index];
          } else {
            branchObj.title = null;
          }

          branchObjArray.push(branchObj);

          resObj.activity = activArray;
          resObj.branches = branchObjArray;
          resArr.push(resObj);
        })
        .get();
      if (resObj.branches) resultArray.push(resObj);
    }


    //DB
    const resultOrganizationIf=await getOrganizationTable()

    if (resultOrganizationIf) {
      
    




    for await (const organization of resultArray){
      console.log(organization.name);
      await addTableOrganization(organization.name)

      

     }
     
        const resGlobObj=await getOrganizationTable()
        console.log(resGlobObj);
       for await (const globObjItems of resultArray ){
       const findRes= resGlobObj[0].find((el)=>el.name===globObjItems.name)
       
        
        await addWebLink(findRes.id,globObjItems.webLink)
       
  
       
       for await (const activ of globObjItems.activity){
        await addTableActivity(findRes.id,activ)
       }
        
        for await (const branch of globObjItems.branches){
         
          await addTableBranch(findRes.id,branch.telephone,branch.adres,branch.latitud,branch.longitud,branch.title)
          
        }
        
       }}else{



        for await (const organization of resultArray){
          console.log(organization.name);
          await addTableOrganization(organization.name)
    
          
    
         }
         
            const resGlobObj=await getOrganizationTable()
            console.log(resGlobObj);
           for await (const globObjItems of resGlobObj[0]){
           const findRes= resultArray.find((el)=>el.name===globObjItems.name)
           
            
            await addWebLink( globObjItems.id,findRes.webLink)
           
      
           
           for await (const activ of findRes.activity){
            await addTableActivity(globObjItems.id,activ)
           }
            
            for await (const branch of findRes.branches){
             
              await addTableBranch(globObjItems.id,branch.telephone,branch.adres,branch.latitud,branch.longitud,branch.title)
              
            }
            
           }

       }

       //DB

    return resultArray
  },
};

export default productService;
