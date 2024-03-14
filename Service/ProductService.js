import cheerio, { html } from "cheerio";
import fetch from "node-fetch";
import axios from "axios";
import { addLinks, getLinksPagesDb, storeQrToDB, useDatabase } from "../Database/Controller.js";
// import { each } from "cheerio/lib/api/traversing.js";
// import { slice } from "cheerio/lib/api/traversing.js";

const productService = {
  spyurController:async ()=>{
    try {
      let array=[]
      let resPagesArray=[]
      // levelOne
      const levelOne=await productService.getBank()
      
      // levelOne


      //levelTwo tareri arajin ejer@
     
      const levelTwo=await productService.getCompanyNames(levelOne)

      //levelTwo tareri arajin ejer@




      //amen meki next
      
     const getLinkBypage = async (linkPage)=>{
          const mainRes=await fetch(`https://www.spyur.am${linkPage}`)
          const html = await mainRes.text();
          const $ = cheerio.load(html);
          
          array.push($(".next_page").attr("href"))
       
          if($(".next_page").attr("href")){
            
            const resf= await getLinkBypage($(".next_page").attr("href"))
            return resf
          }else{return array}
        
        }
        
      //amen meki next
      
      



    const resPagesOne=await Promise.all(levelTwo.map(async (el)=>{
     const getPageOnes=await getLinkBypage(el)
     return getPageOnes
     
     }))

     const linksByAllPages=resPagesOne[resPagesOne.length-1];

     const dbSndlinksByAllPages=(arr)=>{
      try {
        addLinks(arr)
      } catch (error) {
        console.error(error)
      }
     }

     const resConcat=levelTwo.concat(linksByAllPages)
     const filresArray=resConcat.filter((el)=> el !== undefined)
    //  console.log(filresArray);
     await useDatabase()

     await dbSndlinksByAllPages(filresArray)


      //levelThree
    // const levelThreeArrayOne=[]
    // const levelThreeArrayTwo=[]
    //   const levelThreeOne=await productService.getByPageOne(levelTwoArrReversOne)
    //   const levelThreeTwo=await productService.getByPageTwo(levelTwoArrReversTwo)
     
      
      
      
      
      
    //   for(let iOne=0;iOne<levelThreeOne.length;iOne++){
    //     for(let index=0;index<levelThreeOne[iOne].length;index++){
    //       levelThreeArrayOne.push(levelThreeOne[iOne][index])
    //     }
    //   }

    //   for(let i=0;i<levelThreeTwo.length;i++){
    //     for(let index=0;index<levelThreeTwo[i].length;index++){
    //       levelThreeArrayTwo.push(levelThreeTwo[i][index])
    //     }
    //   }
     
    //   const resultArray=levelThreeArrayOne.concat(levelThreeArrayTwo)
      
    //   //levelThree



    //   //levelFour
  
    //   const levelFour=await productService.getDataByPage(resultArray)
     
      
    } catch (error) {
      console.error(error)
    }
  },
  getBank: async () => {
    try {
      const mainPage = await fetch("https://www.spyur.am/am/alphabet/");

      const html = await mainPage.text();
      const $ = cheerio.load(html);
      
      const links = [];
      $(".col-lg-2>a").each((index, element) => {
        const link = $(element).attr("href");
       
        if (link && link.trim() !== "") {
          links.unshift(link);
        }
      });
   
      
      return links;
    } catch (error) {}
  },
  getCompanyNames: async (urls) => {
   
    const yellow_page_array = urls.filter((el) => {
      return el[4] === "y" && el[23] !== "n";
    });

    
   
    const resultArray=[]
    const rrrrr = await Promise.all(yellow_page_array.map(async (link) => {
      const mainPage = await fetch(`https://www.spyur.am/${link}`);
      const html = await mainPage.text();
      const $ = cheerio.load(html);
      
      return  [$(".paging>ul>li>.current_page").attr("href")]
     
  }));
  rrrrr.map((el)=>{
    resultArray.push(el[0])
  })
  
  const filteredForUndefined=resultArray.filter((el)=> el !== undefined)
 
    return filteredForUndefined;
  },
  getByPageTwo: async (linkPage) => {
   
    try {
      const rrrrr = await Promise.all(linkPage.map(async (link) => {
        const mainPage = await fetch(`https://www.spyur.am/${link}`);
        const html = await mainPage.text();
        const $ = cheerio.load(html);
    
        return $(".row>.listing_container>#results_list_wrapper>a").map((index, element) => $(element).attr("href")).get();
    }));

    
    return rrrrr

      
    } catch (error) {}
  },
  getDataByPage: async (linkCompanyLink) => {
    try {
     const data=await Promise.all(linkCompanyLink.map(async(el)=>{
        const resultByComanyName = await fetch(
        `https://www.spyur.am${el}`
      );
      const html = await resultByComanyName.text();
      const $ = cheerio.load(html);
     
      const name = $("h1").text();
      const address = $(".address_block").text().trim();
      const phone = $(".call").text();
      const category = $(".info_content>.text_block>.multilevel_list>li>ul>li>ul>li").text();
      const lat = $("#map_canvas").attr("lat");
      const lon = $("#map_canvas").attr("lon");
      
     
      // await useDatabase();
      // await storeQrToDB(name, address, phone, category, lat, lon);
     
    
      return ({ name, address, phone,category,lat,lon});
      }))
    
      return data
      
    } catch (error) {
      console.error(error)
    }
  },
  getBanks: async () => {
    const mainPage = await fetch(
      "https://www.spyur.am/am/home/advanced_search/?search=1&products_and_services=1&yp_cat3=0406&from=by_home"
    );

    const html = await mainPage.text();
    const $ = cheerio.load(html);
    
    const links = [];

    
    $(".results_list>a").each((index, element) => {
      const link = $(element).attr("href");
     
      if (link && link.trim() !== "") {
        links.unshift(link);
      }
    });
    const dataResult = [];
    const res = await productService.banksByOne(links);
  return res
  },
  


    // const loopLinks = links.map(async (linkCompanyName) => {
    //   const resultByComanyName = await fetch(
    //     `https://www.spyur.am${linkCompanyName}`
    //   );
    //   const html = await resultByComanyName.text();
    //   const $ = cheerio.load(html);
     
    //   const name = $("h1").text();
    //   const address = $(".address_block").text().trim();
    //   const phone = $(".call").text();
    //   const category = $(
    //     ".info_content>.text_block>.multilevel_list>li>ul>li>ul>li"
    //   ).text();
    //   const lat = $("#map_canvas").attr("lat");
    //   const lon = $("#map_canvas").attr("lon");

    //   const data = {
    //     name,
    //     address,
    //     phone,
    //     category,
    //     lat,
    //     lon,
    //   };
    // });
   
  
 
  getLinkBypageLoop:async ()=>{
    try {
      
    } catch (error) {
      console.error(error)
    }
  }

};

export default productService;
