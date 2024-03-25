// import { addTableActivity, addTableBranch, addTableOrganization,addWebLink,createDatabase,deleteDatabase,getActivityTable,getBranchTable,getCompanyLinks,getOrganizationTable,getWebLinkTable,tableBranches,tableCompanyActivity,tableOrganization,tableWebLink,useCompanys, useDatabaseCompanyDB} from "../Database/Controller.js";
// // import { executeQuery } from "./companyService.js";
// import mysql from "mysql2";
// import cheerio, { html } from "cheerio";
// import fetch from "node-fetch";

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "H20021996",
//   database: "companys",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// // Function to execute a query and return a promise
// export function executeQuery(query) {
//   return new Promise((resolve, reject) => {
//     pool.query(query, (err, results, fields) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(results);
//       }
//     });
//   });
// }

// const byOneService = {
//   getByOne: async () => {
//     try {






//       // const linksArray = [
//       //   "/am/companies/aaaa-accounting-center-of-training-and-publishing/3385",
//       //   "/am/companies/ham-tea-production-company/84050",
//       //   "/am/companies/aaa/36862",
//       //   "/am/companies/v8am/33706"
//       // ];

//       await useDatabaseCompanyDB()
//       const linksArray=await getCompanyLinks()

//       const resultArray = [];
  
//       for await (const link of linksArray[0]) {
//         const resultByComanyName = await fetch(`https://www.spyur.am${link.company_link}`);//company_link
//         const html = await resultByComanyName.text();
//         const $ = cheerio.load(html);
//         const activArray=[]
//         const activity = $(".multilevel_list>li>ul>li>ul>li>a")
//           .map((index, element) => $(element).text())
//           .get();
//           if (activity[activity.length-1]) {
//             activArray.push(activity[activity.length-1])
//           }
//           if(activity[activity.length-2]){
//             activArray.push(activity[activity.length-2])
//           }
          
          
//        const status =$("#buffer50comment>span").text()
//        const checker="ՉԻ ԳՈՐԾՈՒՄ"
//       //  if(!(status===checker)){

       
       
//         const name = $("h1").map((index,element)=>{
//           const res=$(element).text()
         
//           return res
//         }).get();
        
        
        
        
        
//         const address = $(".address_block")
//           .map((index, element) => $(element).text())
//           .get();
//         const phone = $(".phone_info")
//           .map((index, element) => $(element).text())
//           .get();
         
//           const titleGet=$(".contacts_list>.branch_block>.contact_subtitle").map((index,element)=>{
//             return $(element).text()
//           }).get()
          
       

//         const webLink=$(".web_link").attr("href")
      
        
//         const nameByAddressArrayOne = [];

//         const branchObjArray = [];
//         const resArr = [];
       
//         const resObj = {
         
//         };
//         const searchRes=name[0].search('"')
       
        
//         if(searchRes===-1){
//           resObj.name=name[0]
//         }else{
//          const resultArr= name[0].split('"')

        
         
//           const oneArray= resultArr[0].split("")
//             oneArray.push("'")
//             const res=oneArray.join("")
//             resultArr.shift()
//             resultArr.unshift(res)
          
          
//             const twoArray= resultArr[resultArr.length-1].split("")
//             twoArray.unshift("'")
//             const resTwo=twoArray.join("")
//             resultArr.pop()
//             resultArr.push(resTwo)
         
            
        
        
//          const resultName=resultArr.join("")
//          console.log("mtnuma objecti mej",resultName);
//          resObj.name=resultName[0]
//         }

//         if(webLink){

        
//         if (webLink.length>8) {
//           if(webLink[8]!=="s" && webLink[12]!=="s"){
//           resObj.webLink=webLink
         
//         }else{
//           resObj.webLink=null
//         }
       
//       }else{
//         resObj.webLink=null
//       }
//     }else{
//       resObj.webLink=null
//     }
        
//         const nameByAddress = $(
//           ".map_ico"
//         )
//           .each(async (index, element) => {
//             const lat = $(element).attr("lat");
//             const lon =$(element).attr("lon")
          
            
// const branchObj = { };
                  
                  
            
             
                  
                 
//                   if(phone[index]){
//                     branchObj.telephone=phone[index]
//                   }else{
//                     branchObj.telephone=null
//                   }
//                   if (address[index]) {
//                     branchObj.adres=address[index]
//                   }else{
//                     branchObj.adres=null
//                   }
//                   if(lat){
//                       branchObj.latitud=lat
//                   }else{
//                       branchObj.latitud=null
//                   }
//                   if (lon) {
//                     branchObj.longitud=lon
//                   }else{
//                     branchObj.longitud=null
//                   }
//                   if(lat){
//                     branchObj.title=titleGet[index]
//                   }else{
//                     branchObj.title=null
//                   }
                  
//                     // branchObj.lat = $(element[index]).attr("lat");
//                     branchObjArray.push(branchObj);
                    
//                     resObj.activity = activArray;
//                     resObj.branches = branchObjArray;
//                     resArr.push(resObj);
                 
                

              
            
              
            
            
//           })
//           .get();
//           if(resObj.branches)
//         resultArray.push(resObj);
//       // }
      


//       //add DB
//       await deleteDatabase()
//       await createDatabase()
//       await useCompanys()
//       await tableOrganization()
//       await tableWebLink()
//       await tableCompanyActivity()
//       await tableBranches()

      
//      for await (const organization of resultArray){
//       console.log(organization.name);
//       await addTableOrganization(organization.name)

      

//      }
     
//         const resGlobObj=await getOrganizationTable()
//        for await (const globObjItems of resGlobObj[0]){
//        const findRes= resultArray.find((el)=>el.name===globObjItems.name)
      
//         // for await (const link of findRes.webLink){
       
        
//         await addWebLink(globObjItems.id,findRes.webLink)
       
//       // }
       
//        for await (const activ of findRes.activity){
//         await addTableActivity(globObjItems.id,activ)
//        }
        
//         for await (const branch of findRes.branches){
         
//           await addTableBranch(globObjItems.id,branch.telephone,branch.adres,branch.latitud,branch.longitud,branch.title)
          
//         }
        
//        }
//     //    //add DB
//       }

//        const resultOrganizationTable=await getOrganizationTable()
//        const resultWebLink=await getWebLinkTable()
//        const resultActivity=await getActivityTable()
//        const resultBranchs=await getBranchTable()

//       //  console.log("arganizationTable",resultOrganizationTable);
//       //  console.log("webLinkTable",resultWebLink);
//       //  console.log("activityTable",resultActivity);
//       //  console.log("branchTable",resultBranchs);
    
//       return resultArray;
//     } catch (error) {
//       console.error(error);
//     }
//   },
// };

// export default byOneService;
