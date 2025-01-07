"use client"
import Image from "next/image"
import { useState } from "react"


// const images = [{
//     id: 1,
//     url: "https://images.pexels.com/photos/14635526/pexels-photo-14635526.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
// },
// {
//     id: 2,
//     url: "https://images.pexels.com/photos/29548508/pexels-photo-29548508/free-photo-of-cozy-window-nook-with-city-view-and-greenery.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
// },
// {
//     id: 3,
//     url: "https://images.pexels.com/photos/29643350/pexels-photo-29643350/free-photo-of-elegant-christmas-decor-on-grand-piano.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
// },
// {
//     id: 4,
//     url: "https://images.pexels.com/photos/29725302/pexels-photo-29725302/free-photo-of-festive-christmas-decorations-with-ornaments.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
// }]


const ProductImages = ({items}:{items:any}) => {
    const [index, setIndex] = useState(0)

    return (
        <div className="">
            <div className="h-[500px] relative">
                <Image src={items[index].image?.url} alt="" fill sizes="50vw" className="object-cover rounded-md" />
            </div>
            <div className="flex justify-between gap-4 mt-8 cursor-pointer">
                {items.map((item:any, i:number) => (
                    <div className="w-1/4 h-32 relative gap-4 mt-8" key={item.title} onClick={()=>setIndex(i)}>
                        <Image src={item.image?.url} alt="" fill sizes="30vw" className="object-cover rounded-md" key={item.title}/>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProductImages