import cheerio, { html } from "cheerio";
import fetch from "node-fetch";
import axios from "axios";
import {
  addLinks,
  addTableActivity,
  addTableBranch,
  addTableOrganization,
  addWebLink,
  getActivityTable,
  getBranchTable,
  getLinksPagesDb,
  getOrganizationTable,
  getWebLinkTable,
  storeQrToDB,
  tableOrganization,
  useCompanys,
  useDatabase,
} from "../Database/Controller.js";
// import { each } from "cheerio/lib/api/traversing.js";
// import { slice } from "cheerio/lib/api/traversing.js";

const productService = {
  getCompanyNames: async (lang_am, page, letter_am) => {
    try {
      const fetchDinamice = async (lang_am, page, letter_am) => {
        // console.log(page);
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
        // console.log("hayeren",linksArrayAm);
        // console.log("ruseren",linkArrRu);
        // console.log("angleren",linkArrEn);

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
            if (activity[activity.length - 1]) {
              activArray.push(activity[activity.length - 1].replace(/'/, ""));
            }
            if (activity[activity.length - 2]) {
              // const resActivReg=regexActiv.test(activity[activity.length - 2])
              activArray.push(activity[activity.length - 2].replace(/'/, ""));
            }

            const status = $("#buffer50comment>span").text();

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
            let result = name[0].replace(/["'()]/g, "");
            resObj.name = result;

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
                if (titleGet[index]) {
                  branchObj.title = titleGet[index];
                } else {
                  branchObj.title = null;
                }

                branchObjArray.push(branchObj);
                if (activArray[0]) {
                  resObj.activity = activArray[0];
                } else {
                  resObj.activity = null;
                }

                resObj.branches = branchObjArray;
                resArr.push(resObj);
              })
              .get();

            if (
              resObj.branches &&
              status !== "ՉԻ ԳՈՐԾՈՒՄ" &&
              status !== "DOESN'T OPERATE" &&
              status !== "НЕ ДЕЙСТВУЕТ" &&
              activArray[0]
            ) {
              resultArray.push(resObj);
            }
          }

          return resultArray;
        };

        // arrayneri funkcianer@ kanchum enq stex
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
          // await tableOrganization()
          const dbByActivFilter = await getActivityTable();
          const filterActiv=await dbByActivFilter[0].find((el)=>{return el.subCategory_am===resultArrayByOneAm[0][i_organ].activity})

          
          if (!filterActiv) {
            await addTableActivity(
              resultArrayByOneAm[0][i_organ].activity,
              resultArrayByOneAm[1][i_organ].activity,
              resultArrayByOneAm[2][i_organ].activity
            );
          }
        }

        const dbActivResult = await getActivityTable();
        for(let indorg=0;indorg<resultArrayByOneAm[0].length;indorg++) {
          // for await(const funcArg of resultArrayByOneAm[0]){

          const findActivbyOrgActivity = await dbActivResult[0].find((el) => {
            // console.log("el.activity_1_am",el.activity_1_am);
            // console.log("activArg.activity",activArg.activity);
            return el.subCategory_am === resultArrayByOneAm[0][indorg].activity;
          });
          
          if (findActivbyOrgActivity) {
            const str = resultArrayByOneAm[1][indorg].name;
            const result = str.replace(/'/g, "");
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
          for (
            let indexbranch = 0;
            indexbranch < resultArrayByOneAm[0][iByLang].branches.length;
            indexbranch++
          ) {
            // console.log(resultArrayByOneAm[1][iByLang]);
            const resultStreet = resultArrayByOneAm[1][iByLang].branches[
              indexbranch
            ].adres.replace(/["'()]/g, "");
            await addTableBranch(
              findRes.id,
              resultArrayByOneAm[0][iByLang].branches[indexbranch].telephone,
              resultArrayByOneAm[0][iByLang].branches[indexbranch].adres,
              resultStreet,
              resultArrayByOneAm[2][iByLang].branches[indexbranch].adres,
              resultArrayByOneAm[2][iByLang].branches[indexbranch].latitud,
              resultArrayByOneAm[2][iByLang].branches[indexbranch].longitud,
              resultArrayByOneAm[0][iByLang].branches[indexbranch].title,
              resultArrayByOneAm[1][iByLang].branches[indexbranch].title,
              resultArrayByOneAm[2][iByLang].branches[indexbranch].title
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

        // const resultOrganizationIf = await getOrganizationTable();

        // if (resultOrganizationIf) {
        //   for (let i = 0; i < resultArrayByOneAm[0].length; i++) {
        //     await addTableOrganization(
        //       resultArrayByOneAm[0][i].name,
        //       resultArrayByOneAm[0][i].letter
        //     );
        //   }

        //   const resGlobObj = await getOrganizationTable();

        //   for await (const globObjItems of resultArrayByOneAm[0]) {
        //     const findRes = resGlobObj[0].find(
        //       (el) => el.name === globObjItems.name
        //     );

        //     if (globObjItems.webLink) {
        //       await addWebLink(findRes.id, globObjItems.webLink);
        //     }

        //     if (globObjItems.activity) {
        //       for await (const activ of globObjItems.activity) {
        //         await addTableActivity(findRes.id, activ);
        //       }
        //     }

        //     for await (const branch of globObjItems.branches) {
        //       if (branch.title) {
        //         await addTableBranch(
        //           findRes.id,
        //           branch.telephone,
        //           branch.adres,
        //           branch.latitud,
        //           branch.longitud,
        //           branch.title
        //         );
        //       } else {
        //         await addTableBranch(
        //           findRes.id,
        //           branch.telephone,
        //           branch.adres,
        //           branch.latitud,
        //           branch.longitud,
        //           null
        //         );
        //       }
        //     }
        //   }
        // } else {
        //   for (let ind = 0; ind < resultArrayByOneAm[0].length; ind++) {
        //     await addTableOrganization(
        //       resultArrayByOneAm[0][ind].name,
        //       resultArrayByOneAm[0][ind].letter
        //     );
        //   }

        //   const resGlobObj = await getOrganizationTable();

        //   for await (const globObjItems of resGlobObj[0]) {
        //     const findRes = resultArrayByOneAm[0].find(
        //       (el) => el.name === globObjItems.name
        //     );

        //     await addWebLink(globObjItems.id, findRes.webLink);

        //     for await (const activ of findRes.activity) {
        //       await addTableActivity(globObjItems.id, activ);
        //     }

        //     for await (const branch of findRes.branches) {
        //       await addTableBranch(
        //         globObjItems.id,
        //         branch.telephone,
        //         branch.adres,
        //         branch.latitud,
        //         branch.longitud,
        //         branch.title
        //       );
        //     }
        //   }
        // }

        // DB
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

      return resultArray;
    } catch (error) {
      console.error(error);
    }
  },
};

export default productService;
