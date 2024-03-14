import companyService from "../Service/companyService.js"

const companyController={
    getCompanyByPageLinks:async (req,res)=>{
        try {
          const getLinks=await companyService.getCompanyByPageLinks()
          res.status(200).send(getLinks)
        } catch (error) {
          console.error(error)
        }
      },
}

export default companyController