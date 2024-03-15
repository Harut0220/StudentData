import { addCompanyLinks, getLinksPagesDb, useDatabase, useDatabaseCompanyDB } from "../Database/Controller.js";
import mysql from 'mysql2';
import cheerio, { html } from "cheerio";
import fetch from "node-fetch";

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'H20021996',
  database: 'spyur',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
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

// Example usage
// const resdb=await executeQuery('SELECT * FROM page_links;')
//   .then((results) => {
//     return results;
//   })
//   .catch((err) => {
//     console.error(err);
//   });



const companyService={
    getCompanyByPageLinks:async ()=>{
        try {
            const resdb=await executeQuery('SELECT * FROM page_links;')
            .then((results) => {
              return results;
            })
            .catch((err) => {
              console.error(err);
            });
            //erku kes
            const arrayPipeOne=resdb.slice(0,(resdb.length/2))
            const arrayPipeTwo=resdb.slice(((resdb.length/2)-0.5),(resdb.length))
            
            //erku kes

            //arajin kesery kisac
            const onePipeOne=arrayPipeOne.slice(0,(arrayPipeOne.length/2))
                const onePipeOneResOne= onePipeOne.slice(0,(onePipeOne.length/2))
                const onePipeOneResTwo=onePipeOne.slice(((onePipeOne.length/2)-0.5),(onePipeOne.length+0.5))
            const onePipeTwo=arrayPipeOne.slice(((arrayPipeOne.length/2)-0.5),(arrayPipeOne.length+0.5))
                const onePipeTwoResOne=onePipeTwo.slice(0,((onePipeTwo.length/2)-0.5))
                const onePipeTwoResTwo=onePipeTwo.slice(((onePipeTwo.length/2)-0.5),(onePipeTwo.length))
            //arajin kesery kisac

            //erkrork kesery kisac
            const twoPipeOne=arrayPipeTwo.slice(0,(arrayPipeTwo.length/2))
                const twoPipeOneResOne=twoPipeOne.slice(0,(twoPipeOne.length/2))
                const twoPipeOneResTwo=twoPipeOne.slice(((twoPipeOne.length/2)+0.5),(twoPipeOne.length))
            const twoPipeTwo=arrayPipeTwo.slice(((arrayPipeTwo.length/2)+0.5),(arrayPipeTwo.length))
                const twoPipeTwoResOne=twoPipeTwo.slice(0,(twoPipeTwo.length/2))
                const twoPipeTwoResTwo=twoPipeTwo.slice(((twoPipeTwo.length/2)+0.5),(twoPipeTwo.length))
            //erkrork kesery kisac
            const arrayFour=[]
            // console.log("1 skizb",onePipeOneResOne[0]);
            // console.log("1 verj",onePipeOneResOne[onePipeOneResOne.length-1]);

            // console.log("2 skizb",onePipeOneResTwo[0]);
            // console.log("2 verj",onePipeOneResTwo[onePipeOneResTwo.length-1]);

            // console.log("3 skizb",onePipeTwoResOne[0]);
            // console.log("3 verj",onePipeTwoResOne[onePipeTwoResOne.length-1]);

            // console.log("4 skizb",onePipeTwoResTwo[0]);
            // console.log("4 verj",onePipeTwoResTwo[onePipeTwoResTwo.length-1]);

            // console.log("5 skizb",twoPipeOneResOne[0]);
            // console.log("5 verj",twoPipeOneResOne[twoPipeOneResOne.length-1]);

            // console.log("6 skizb",twoPipeOneResTwo[0]);
            // console.log("6 verj",twoPipeOneResTwo[twoPipeOneResTwo.length-1]);

            // console.log("7 skizb",twoPipeTwoResOne[0]);
            // console.log("7 verj",twoPipeTwoResOne[twoPipeTwoResOne.length-1]);

            // console.log("8 skizb",twoPipeTwoResTwo[0]);
            // console.log("8 verj",twoPipeTwoResTwo[twoPipeTwoResTwo.length-1]);
           
            let resultAllArray=[]

            const resultCompanyOnePipeOne=await companyService.getByPageOne(onePipeOneResOne);
            for await (const link1 of resultCompanyOnePipeOne){
              resultAllArray.push(link1)
            }
            console.log(resultCompanyOnePipeOne.length);
            const resultCompanyOnePipeTwo=await companyService.getByPageOne(onePipeOneResTwo)
            for await (const link2 of resultCompanyOnePipeTwo){
              resultAllArray.push(link2)
            }
            console.log(resultCompanyOnePipeTwo.length);
            const resultCompanyTwoPipeThree=await companyService.getByPageOne(onePipeTwoResOne);
            for await (const link3 of resultCompanyTwoPipeThree){
              resultAllArray.push(link3)
            }
            console.log(resultCompanyTwoPipeThree.length);
            const resultCompanyTwoPipeFour=await companyService.getByPageOne(onePipeTwoResTwo)
            for await (const link4 of resultCompanyTwoPipeFour){
              resultAllArray.push(link4)
            }
            console.log(resultCompanyTwoPipeFour.length);
            const resultCompanyTwoPipeFive=await companyService.getByPageOne(twoPipeOneResOne)
            for await (const link5 of resultCompanyTwoPipeFive){
              resultAllArray.push(link5)
            }
            console.log(resultCompanyTwoPipeFive.length);
            const resultCompanyTwoPipeSix=await companyService.getByPageOne(twoPipeOneResTwo)
            for await (const link6 of resultCompanyTwoPipeSix){
              resultAllArray.push(link6)
            }
            console.log(resultCompanyTwoPipeSix.length);
            const resultCompanyTwoPipeSeven=await companyService.getByPageOne(twoPipeTwoResOne)
            for await (const link7 of resultCompanyTwoPipeSeven){
              resultAllArray.push(link7)
            }
            console.log(resultCompanyTwoPipeSeven.length);
            const resultCompanyTwoPipeEight=await companyService.getByPageOne(twoPipeTwoResTwo)
            for await (const link8 of resultCompanyTwoPipeEight){
              resultAllArray.push(link8)
            }
            console.log(resultCompanyTwoPipeEight.length);

            
            
            console.log(resultAllArray);
            console.log(resultAllArray.length);
            
            
            
            await useDatabaseCompanyDB()
            await addCompanyLinks(resultAllArray)
          return resultAllArray
        } catch (error) {
          
        }
      },
      getByPageOne: async (linkPage) => {
        // console.log(linkPage);
        try {
            const rrrrr = [];
            for await (const link of linkPage) {
                const mainPage = await fetch(`https://www.spyur.am${link.pageLink}`);
                const html = await mainPage.text();
                const $ = cheerio.load(html);
                const links = $(".results_list>a").map((index, element) => $(element).attr("href")).get();
                rrrrr.push(links);
            }
            
        let levelThreeArrayOne=[]
         for(let iOne=0;iOne<rrrrr.length;iOne++){
        for(let index=0;index<rrrrr[iOne].length;index++){
          levelThreeArrayOne.push(rrrrr[iOne][index])
        }
      }


        return levelThreeArrayOne
    
          
        } catch (error) {}
      },
      banksByOne: async (links) => {
        const arr=[]
        const rrrrr = await Promise.all(links.map(async (link) => {
          const mainPage = await fetch(`https://www.spyur.am/${link}`);
          const html = await mainPage.text();
          const $ = cheerio.load(html);
         
          const activity=$(".multilevel_list>li>ul>li>ul>li>a").map((index, element) => $(element).text()).get()
          const name = $("h1").text();
          const address = $(".address_block").map((index,element)=>$(element).text()).get();
          const phone = $(".phone_info").map((index,element)=>$(element).text()).get()
          const lat = $("#map_canvas").attr("lat");
          const lon = $("#map_canvas").attr("lon");
          const datObj={
            name,
            activity,
            address,
            phone,
            lat,
            lon,
          }
          return datObj
      }));
      return rrrrr;
    },
}


export default companyService