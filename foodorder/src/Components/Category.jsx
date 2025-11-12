 import { SiCoderwall } from "react-icons/si";
 import { MdOutlineFreeBreakfast } from "react-icons/md";
 import { TbSoup } from "react-icons/tb";
 import { FaBowlFood } from "react-icons/fa6";
 import { MdDomainVerification } from "react-icons/md";
 import { FaPizzaSlice } from "react-icons/fa6";
 import { CiBurger } from "react-icons/ci";
 const Category=[
    {
        id:1,
        name:"All",
        image:<SiCoderwall className="text-orange-300 "/>
    },
    {
        id:2,
        name:"Breakfast",
        image:<MdOutlineFreeBreakfast className="text-orange-300 " />
    },
    {
        id:3,
        name:"Soups",
        image:<TbSoup className="text-orange-300 "/>
    },
    {
        id:4,
        name:"Pasta",
        image:<FaBowlFood className="text-orange-300  "/>
    },
    {
        id:5,
        name:"Main",
        image:<MdDomainVerification className="text-orange-300 " />
    },
    {
        id:6,
        name:"Pizza",
        image:<FaPizzaSlice className="text-orange-300 " />
    },
    {
        id:7,
        name:"Burgers",
        image:<CiBurger className="text-orange-300 " />  
    }
]

export default Category;