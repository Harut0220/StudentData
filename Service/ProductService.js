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
  useBrand,
  useCompanys,
} from "../Database/Controller.js";

const productService = {
  createTrademarks: async (lang, page, letter) => {
    try {
      const fetchDinamice = async (lang, page, letter) => {
        const linksBrandArrayAm = [];
        const linksBrandArrayEn = [];
        const linksBrandArrayRu = [];
        const fetchResult = await fetch(
          `https://www.spyur.am/${lang}/trademarks-${page}/${letter}/?from=home&from=home&tab=trademarks_am`
        );

        const html = await fetchResult.text();
        const $ = cheerio.load(html);
        const brandLink = $(".company_num>a")
          .each((index, element) => {
            const resObj = {};
            const link = $(element).attr("href");
            const brand = $(element).attr("title");
            resObj.link = link;
            resObj.brand = brand;
            linksBrandArrayAm.push(resObj);
          })
          .get();

        const fetchResult1 = await fetch(
          `https://www.spyur.am/en/trademarks-${page}/${letter}/?from=home&from=home&tab=trademarks_en`
        );

        const html1 = await fetchResult1.text();
        const $1 = cheerio.load(html1);
        const brandLink1 = $1(".company_num>a")
          .each((index, element) => {
            const resObj = {};
            const link = $(element).attr("href");
            const brand = $(element).attr("title");
            resObj.link = link;
            resObj.brand = brand;
            linksBrandArrayEn.push(resObj);
          })
          .get();

        const fetchResult2 = await fetch(
          `https://www.spyur.am/ru/trademarks-${page}/${letter}/?from=home&from=home&tab=trademarks_ru`
        );

        const html2 = await fetchResult2.text();
        const $2 = cheerio.load(html2);
        const brandLink2 = $2(".company_num>a")
          .each((index, element) => {
            const resObj = {};
            const link = $(element).attr("href");
            const brand = $(element).attr("title");
            resObj.link = link;
            resObj.brand = brand;
            linksBrandArrayRu.push(resObj);
          })
          .get();

        return [linksBrandArrayAm, linksBrandArrayEn, linksBrandArrayRu];
      };

      const arrayByAm = await fetchDinamice(lang, page, letter);

      // const linkArrRu = [];
      // const linkArrEn = [];
      // for (let indexLink = 0; indexLink < arrayByAm.length; indexLink++) {
      //   const spliteRu = arrayByAm[indexLink].split("/");
      //   spliteRu[1] = "ru";
      //   const resultRuArray = spliteRu.join("/");
      //   linkArrRu.push(resultRuArray);
      // }
      // for (let indEn = 0; indEn < arrayByAm.length; indEn++) {
      //   const spliteEn = arrayByAm[indEn].split("/");
      //   spliteEn[1] = "en";
      //   const resultEnArray = spliteEn.join("/");
      //   linkArrEn.push(resultEnArray);
      // }

      await useBrand();
      const linksByBrandArrayAm = [];
      const linksByBrandArrayEn = [];
      const linksByBrandArrayRu = [];
      const brandNameAmArr = [];
      const brandNameEnArr = [];
      const brandNameRuArr = [];
      const byLangFun = async (resFunc) => {
        for await (const linksbylangAm of resFunc[0]) {
          const fetchBrandAm = await fetch(
            `https://www.spyur.am${linksbylangAm.link}`
          );

          const html1 = await fetchBrandAm.text();

          const $1 = cheerio.load(html1);
          const linksCompanysAm = $1(".results_list>a").each(
            (index, element) => {
              const linkByBrands = $1(element).attr("href");
              const resObjAm = {};

              resObjAm.link = linkByBrands;
              resObjAm.brand = linksbylangAm.brand;
              linksByBrandArrayAm.push(resObjAm);
            }
          );
        }
        for await (const linksbylangEn of resFunc[1]) {
          const fetchBrandAm = await fetch(
            `https://www.spyur.am${linksbylangEn.link}`
          );

          const html1 = await fetchBrandAm.text();

          const $1 = cheerio.load(html1);
          const linksCompanysAm = $1(".results_list>a").each(
            (index, element) => {
              const linkByBrands = $1(element).attr("href");
              const resObjEn = {};

              resObjEn.link = linkByBrands;
              resObjEn.brand = linksbylangEn.brand;
              linksByBrandArrayEn.push(resObjEn);
            }
          );
        }
        for await (const linksbylangRu of resFunc[2]) {
          const fetchBrandAm = await fetch(
            `https://www.spyur.am${linksbylangRu.link}`
          );

          const html1 = await fetchBrandAm.text();

          const $1 = cheerio.load(html1);
          const linksCompanysAm = $1(".results_list>a").each(
            (index, element) => {
              const linkByBrands = $1(element).attr("href");
              const resObjRu = {};

              resObjRu.link = linkByBrands;
              resObjRu.brand = linksbylangRu.brand;
              linksByBrandArrayRu.push(resObjRu);
            }
          );
        }

        return [linksByBrandArrayAm, linksByBrandArrayEn, linksByBrandArrayRu];
      };

      const brandFuncAm = await byLangFun(arrayByAm);

      const linksFuncBylangArrays = async (linksArraybyLang) => {
        const resultArray = [];
        for await (const link of linksArraybyLang) {
         

          const fetchCompany = await fetch(`https://www.spyur.am${link.link}`);
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
            if (link.brand) {
              resObj.brand = link.brand;
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
                if (lon && lat && activArray[0]) {
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

      const armenian = await linksFuncBylangArrays(brandFuncAm[0]).then(
        (res) => {
          return res;
        }
      );
      const english = await linksFuncBylangArrays(brandFuncAm[1]).then(
        (res) => {
          return res;
        }
      );
      const russian = await linksFuncBylangArrays(brandFuncAm[2]).then(
        (res) => {
          return res;
        }
      );
      // console.log("armenian",armenian);
      // console.log("english",english);
      // console.log("russian",russian);

      const resultArrayByOneAm = [armenian, english, russian];

      const dbGlobalFunc = async (resultArrayByOneAm) => {
        for (
          let i_organ = 0;
          i_organ < resultArrayByOneAm[0].length;
          i_organ++
        ) {
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


        for (
          let i_organ = 0;
          i_organ < resultArrayByOneAm[0].length;
          i_organ++
        ) {
          const dbByActivFilter = await getActivityTable();
          const filterActiv = await dbByActivFilter[0].find((el) => {
            return (
              el.subCategory_am === resultArrayByOneAm[0][i_organ].activity
            );
          });

          if (!filterActiv) {
            await addTableActivity(
              resultArrayByOneAm[0][i_organ].brand,
              resultArrayByOneAm[1][i_organ].brand,
              resultArrayByOneAm[2][i_organ].brand
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
              const pathBd = outputPath.split("/");
              pathBd.shift();
              const resPathDb = pathBd.join("/");
              downloadImage(imageUrl, outputPath)
                .then(() => console.log("Image downloaded successfully"))
                .catch((err) => console.error("Error downloading image:", err));
              await addTableImages(findRes.id, resPathDb);
            }
          }
          for (
            let indexbranch = 0;
            indexbranch < resultArrayByOneAm[0][iByLang].branches.length;
            indexbranch++
          ) {
            if (resultArrayByOneAm[1][iByLang].branches[indexbranch]) {
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
      await dbGlobalFunc(resultArrayByOneAm);

      return resultArrayByOneAm;
    } catch (error) {
      console.error(error);
    }
  },

















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
            if (
              link !== "/am/companies/hakob-1-book-and-stationery-store/4457" &&
              link !== "/en/companies/hakob-1-book-and-stationery-store/4457" &&
              link !== "/ru/companies/hakob-1-book-and-stationery-store/4457" &&
              link !==
                "/am/companies/berd-service-office-of-the-cadastre-committee/70891" &&
              link !==
                "/en/companies/berd-service-office-of-the-cadastre-committee/70891" &&
              link !==
                "/ru/companies/berd-service-office-of-the-cadastre-committee/70891" &&
              link !==
                "/am/companies/artashat-service-office-of-the-cadastre-committee/26816" &&
              link !==
                "/en/companies/artashat-service-office-of-the-cadastre-committee/26816" &&
              link !==
                "/ru/companies/artashat-service-office-of-the-cadastre-committee/26816" &&
              link !== "/am/companies/mary-israyelyan-guesthouse/45537" &&
              link !== "/en/companies/mary-israyelyan-guesthouse/45537" &&
              link !== "/ru/companies/mary-israyelyan-guesthouse/45537" &&
              link !== "/am/companies/nairi-hotel/46864" &&
              link !== "/en/companies/nairi-hotel/46864" &&
              link !== "/ru/companies/nairi-hotel/46864" &&
              link !== "/am/companies/hak-shin-building-materials-shop/50105" &&
              link !== "/en/companies/hak-shin-building-materials-shop/50105" &&
              link !== "/ru/companies/hak-shin-building-materials-shop/50105"
            ) {
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
                    const titleGet = $(element)
                      .find(".contact_subtitle")
                      .text();

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
                    if (lon && lat && activArray[0]) {
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
      console.log(
        resultArrayByOneAm,
        resultArrayByOneAm.length,
        resultArrayByOneAm[0].length,
        resultArrayByOneAm[1].length,
        resultArrayByOneAm[2].length
      );
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

              // console.log("resultArrayByOneAm[0][iByLang].image[imgIndex]",resultArrayByOneAm[0][iByLang].image[imgIndex]);
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
              const pathBd = outputPath.split("/");
              pathBd.shift();
              const resPathDb = pathBd.join("/");
              downloadImage(imageUrl, outputPath)
                .then(() => console.log("Image downloaded successfully"))
                .catch((err) => console.error("Error downloading image:", err));
              await addTableImages(findRes.id, resPathDb);
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
      const images = await getImagesTable();

      // console.log("organization",organization[0]);
      // console.log("webLink",filterNull);
      // console.log("subcategories",activity[0]);
      // console.log("branchs",branchs[0]);
      // console.log("images",images[0]);
      // // console.log(branchs[0]);
      const resultArray = [];
      const filterLink = await webLink[0].filter((el) => {
        return el.weblink === "null";
      });
      //  console.log(filterLink);
      let count = 1;
      for await (const link of filterLink) {
        const findOrganiz = await organization[0].find((el) => {
          return el.id === link.organization_id;
        });
        const findBranch = await branchs[0].find((el) => {
          return el.organization_id === link.organization_id;
        });
        let obj = {};
        obj.Number = count;
        obj.name = findOrganiz.name_am;
        obj.phone = findBranch.telephone;
        count++;
        resultArray.push(obj);
      }

      console.log(resultArray);
      // console.log("organ length",organization[0].length);
      // console.log("weblinks length",webLink[0].length);
      // console.log(webLink[0][webLink[0].length-10]);
      // const filterWeblink=organization[0].filter((el)=>{return el.webLink.weblink==="null"})

      return resultArray;
    } catch (error) {
      console.error(error);
    }
  },
  getUrl: async () => {
    try {
    } catch (error) {
      console.error(error);
    }
  },
};

export default productService;
