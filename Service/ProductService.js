import cheerio from "cheerio";
import fetch from "node-fetch";
import fs from "fs";
import {
  addTableActivity,
  addTableBranch,
  addTableImages,
  addTableOrganization,
  addWebLink,
  getActivityTable,
  getBranchTable,
  getImagesTable,
  getOrganizationTable,
  getWebLinkTable,
  useCompanys,
} from "../Database/Controller.js";

const productService = {
  getCompanyNames: async (lang_am, page, letter_am) => {
    try {
      const fetchDinamice = async (lang_am, page, letter_am) => {
        const linksArrayAm = [];

        const fetchResult = await fetch(
          `https://www.spyur.am/${lang_am}/yellow_pages-${page}/alpha/${letter_am}/?from=home&tab=yello_p_am`
        );

        const html = await fetchResult.text();
        const $1 = cheerio.load(html);

        const links = $1(".results_list>a")
          .each((index, element) => {
            const link = $1(element).attr("href");
            linksArrayAm.push(link);
          })
          .get();

        const linkArrRu = [];
        const linkArrEn = [];
        for (let indexLink = 0; indexLink < linksArrayAm.length; indexLink++) {
          const spliteRu = linksArrayAm[indexLink].split("/");
          spliteRu[1] = "ru";
          const resultRuArray = spliteRu.join("/");
          linkArrRu.push(resultRuArray);
        }
        for (let indEn = 0; indEn < linksArrayAm.length; indEn++) {
          const spliteEn = linksArrayAm[indEn].split("/");
          spliteEn[1] = "en";
          const resultEnArray = spliteEn.join("/");
          linkArrEn.push(resultEnArray);
        }

        const linksFuncBylangArrays = async (linksArraybyLang) => {
          const resultArray = [];
          for await (const link of linksArraybyLang) {
            const fetchCompany = await fetch(`https://www.spyur.am${link}`);
            const html = await fetchCompany.text();
            const $ = cheerio.load(html);
            const activArray = [];
            const activity = $(".multilevel_list>li>ul>li>ul>li>a")
              .map((index, element) => $(element).text())
              .get();
            const regexActiv = /'/;
            if (activity) {
              if (activity[activity.length - 1]) {
                activArray.push(
                  activity[activity.length - 1].replace(/["'()]/g, "")
                );
              }
              if (activity[activity.length - 2]) {
                activArray.push(
                  activity[activity.length - 2].replace(/["'()]/g, "")
                );
              }

              const status = $("#buffer50comment>span").text();

              const name = $("h1")
                .map((index, element) => {
                  const res = $(element).text();

                  return res;
                })
                .get();

              const webLink = $(".web_link").attr("href");
              let imgArray = [];
              const image = $(".slide_block>a")
                .each((index, element) => {
                  const resultImg = $(element).attr("href");
                  if (resultImg[0] !== "h") {
                    imgArray.push(resultImg);
                  }
                })
                .get();
              console.log(imgArray);
            

              const branchObjArray = [];
              const resArr = [];

              const resObj = {};
              let result = name[0].replace(/["'()]/g, "");

              resObj.name = result;
              //find company name in db

              const forFindOrg = await getOrganizationTable();

              const findDbOrg = await forFindOrg[0].find((el) => {
                return (
                  el.name_am === resObj.name ||
                  el.name_en === resObj.name ||
                  el.name_ru === resObj.name
                );
              });

              //find company name in db
              if (imgArray[0]) {
                resObj.image = imgArray;
              } else {
                resObj.image = null;
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

              const nameByAddress = $(".branch_block")
                .map(async (index, element) => {
                  //stexic
                  const workTime = $(element).find(".work_hours").text();
                  const lat = $(element).find(".map_ico").attr("lat");
                  const lon = $(element).find(".map_ico").attr("lon");
                  const branchObj = {};
                  const phone = $(element).find(".phone_info").text();
                  const address = $(element).find(".address_block").text();
                  const titleGet = $(element).find(".contact_subtitle").text();

                  if (phone[index] && lon && lat) {
                    branchObj.telephone = phone;
                  } else {
                    branchObj.telephone = null;
                  }
                  if (address[index] && lon && lat) {
                    branchObj.adres = address.replace(/["'()]/g, "");
                  } else {
                    branchObj.adres = null;
                  }
                  if (lon && lat) {
                    branchObj.latitud = lat;
                  } else {
                    branchObj.latitud = null;
                  }
                  if (lon && lat) {
                    branchObj.longitud = lon;
                  } else {
                    branchObj.longitud = null;
                  }
                  if (workTime[index] && lon && lat) {
                    branchObj.workTime = workTime;
                  } else {
                    branchObj.workTime = null;
                  }
                  if (titleGet[index] && lon && lat) {
                    branchObj.title = titleGet.replace(/["'()]/g, "");
                  } else {
                    branchObj.title = null;
                  }
                  if (lon && lat) {
                    branchObjArray.push(branchObj);
                  }

                  if (activArray[0] && lon && lat) {
                    resObj.activity = activArray[0];
                  } else {
                    resObj.activity = null;
                  }
                  if (lon && lat&&activArray[0]) {
                    resObj.branches = branchObjArray;
                  }

                  if (lon && lat) {
                    resArr.push(resObj);
                  }
                })
                .get(); //stex
              if (!findDbOrg) {
                if (
                  resObj.branches &&
                  status !== "ՉԻ ԳՈՐԾՈՒՄ" &&
                  status !== "DOESN'T OPERATE" &&
                  status !== "НЕ ДЕЙСТВУЕТ" &&
                  resObj.activity
                ) {
                  resultArray.push(resObj);
                }
              }
            }
          }

          return resultArray;
        };

        // lang array function
        const armenian = await linksFuncBylangArrays(linksArrayAm).then(
          (res) => {
            return res;
          }
        );
        const english = await linksFuncBylangArrays(linkArrEn).then((res) => {
          return res;
        });
        const russian = await linksFuncBylangArrays(linkArrRu).then((res) => {
          return res;
        });
        return [armenian, english, russian];
      };
      // lang array function

      const resultArrayByOneAm = await fetchDinamice(
        lang_am,
        page,
        letter_am
      ).then((res) => {
        return res;
      });

      const dbGlobalFunc = async (resultArrayByOneAm) => {
        for (
          let i_organ = 0;
          i_organ < resultArrayByOneAm[0].length;
          i_organ++
        ) {
          await useCompanys();

          const dbByActivFilter = await getActivityTable();
          const filterActiv = await dbByActivFilter[0].find((el) => {
            return (
              el.subCategory_am === resultArrayByOneAm[0][i_organ].activity
            );
          });

          if (!filterActiv) {
            await addTableActivity(
              resultArrayByOneAm[0][i_organ].activity,
              resultArrayByOneAm[1][i_organ].activity,
              resultArrayByOneAm[2][i_organ].activity
            );
          }
        }

        const dbActivResult = await getActivityTable();
        for (let indorg = 0; indorg < resultArrayByOneAm[0].length; indorg++) {
          const findActivbyOrgActivity = await dbActivResult[0].find((el) => {
            return el.subCategory_am === resultArrayByOneAm[0][indorg].activity;
          });

          if (findActivbyOrgActivity) {
            await addTableOrganization(
              resultArrayByOneAm[0][indorg].name,
              resultArrayByOneAm[1][indorg].name,
              resultArrayByOneAm[2][indorg].name,
              findActivbyOrgActivity.id
            );
          }
        }

        const resGlobObj = await getOrganizationTable();
        // globObjItems
        for (
          let iByLang = 0;
          iByLang < resultArrayByOneAm[0].length;
          iByLang++
        ) {
          const findRes = resGlobObj[0].find((el) => {
            return el.name_am === resultArrayByOneAm[0][iByLang].name;
          });

          if (resultArrayByOneAm[0][iByLang].image !== null) {
            for (
              let imgIndex = 0;
              imgIndex < resultArrayByOneAm[0][iByLang].image.length;
              imgIndex++
            ) {
              async function downloadImage(url, outputPath) {
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                fs.writeFileSync(outputPath, buffer); // For Node.js, skip this if you're working in the browser
              }

              // Usage

              
              const imageUrl = `https://www.spyur.am/${resultArrayByOneAm[0][iByLang].image[imgIndex]}`;
              const splimg = imageUrl.split("/");
              const resimg = splimg[splimg.length - 1].split("?");
              const dirPath = `./public/images/${findRes.id}`;

              fs.mkdir(dirPath, { recursive: true }, (err) => {
                if (err) {
                  console.error(err);
                  return;
                }
                console.log("Directory created successfully");
              });
              const outputPath = `./public/images/${findRes.id}/${resimg[0]}`; // Specify the path where you want to save the image
              const pathBd=outputPath.split("/")
              pathBd.shift()
              const resPathDb=pathBd.join("/")
              downloadImage(imageUrl, outputPath)
                .then(() => console.log("Image downloaded successfully"))
                .catch((err) => console.error("Error downloading image:", err));
              await addTableImages(
                findRes.id,
                resPathDb
              );
            }
          }
          for (
            let indexbranch = 0;
            indexbranch < resultArrayByOneAm[0][iByLang].branches.length;
            indexbranch++
          ) {
            await addTableBranch(
              findRes.id,
              resultArrayByOneAm[0][iByLang].branches[indexbranch].telephone,
              resultArrayByOneAm[0][iByLang].branches[indexbranch].adres,
              resultArrayByOneAm[1][iByLang].branches[indexbranch].adres,
              resultArrayByOneAm[2][iByLang].branches[indexbranch].adres,
              resultArrayByOneAm[2][iByLang].branches[indexbranch].latitud,
              resultArrayByOneAm[2][iByLang].branches[indexbranch].longitud,
              resultArrayByOneAm[0][iByLang].branches[indexbranch].title,
              resultArrayByOneAm[1][iByLang].branches[indexbranch].title,
              resultArrayByOneAm[2][iByLang].branches[indexbranch].title,
              resultArrayByOneAm[0][iByLang].branches[indexbranch].workTime,
              resultArrayByOneAm[1][iByLang].branches[indexbranch].workTime,
              resultArrayByOneAm[2][iByLang].branches[indexbranch].workTime
            );
          }

          if (resultArrayByOneAm[0][iByLang].webLink) {
            await addWebLink(
              findRes.id,
              resultArrayByOneAm[0][iByLang].webLink
            );
          } else {
            await addWebLink(findRes.id, null);
          }
        }

      };

     //DB
      dbGlobalFunc(resultArrayByOneAm);

      return resultArrayByOneAm;
    } catch (error) {
      console.error(error);
    }
  },
  getData: async () => {
    try {
      await useCompanys();
      const organization = await getOrganizationTable();
      const webLink = await getWebLinkTable();
      const activity = await getActivityTable();
      const branchs = await getBranchTable();
      const images=await getImagesTable()
     
      // console.log("organization",organization[0]);
      // console.log("webLink",filterNull);
      // console.log("subcategories",activity[0]);
      // console.log("branchs",branchs[0]);
      // console.log("images",images[0]);
      // // console.log(branchs[0]);
      const resultArray = [];
      for await (const organiz of organization[0]) {
        const resultWebLink = await webLink[0].filter((el) => {
          return el.organization_id === organiz.id;
        });
        resultWebLink.map((el) => {
          delete el.id;
          delete el.organization_id;
        });
        if (resultWebLink[0] === undefined) {
          organiz.webLink = null;
        } else {
          organiz.webLink = resultWebLink;
        }

        const resultActivity = await activity[0].filter((el) => {
          return el.organization_id === organiz.id;
        });
        const resultImages=await images[0].filter((el)=>{
          return el.organization_id===organiz.id
        })
        organiz.images=resultImages
        if (resultActivity) {
          resultActivity.map((el) => {
            delete el.id;
            delete el.organization_id;
          });
          if (resultActivity[0] === undefined) {
            organiz.activity = null;
          } else {
            organiz.activity = resultActivity;
          }
        }

        const resultBranchs = await branchs[0].filter((el) => {
          return el.organization_id === organiz.id;
        });
        resultBranchs.map((el) => {
          delete el.id;
          delete el.organization_id;
        });
        if (resultBranchs[0] === undefined) {
          organiz.branchs = null;
        } else {
          organiz.branchs = resultBranchs;
        }
        resultArray.push(organiz);
      }
      // console.log("organ length",organization[0].length);
      // console.log("weblinks length",webLink[0].length);
      // console.log(webLink[0][webLink[0].length-10]);
      return organization[0];
    } catch (error) {
      console.error(error);
    }
  },
};

export default productService;
