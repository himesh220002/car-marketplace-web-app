const Condition = [
    {
        id: 1,
        name: "Excellent"
    },
    {
        id: 2,
        name: "Good"
    },
    {
        id: 3,
        name: "Fair"
    },
    {
        id: 4,
        name: "Needs Repair"
    },
    {
        id: 5,
        name: "Salvage"
    },
    
]
const Type = [
    {
        id:1,
        name:"New"
    },
    {
        id:2,
        name:"Used"
    },
    {
        id:3,
        name:"Certified Pre-Owned"
    },
    {
        id:4,
        name:"Demo"
    },
    {
        id:5,
        name:"Rental"
    },
    
]
const CarMakes = [
    {
        id: 1,
        name: "Audi"
    },
    {
        id: 2,
        name: "BMW"
    },
    {
        id: 3,
        name: "Ford"
    },
    {
        id: 5,
        name: "Toyota"
    },
    {
        id: 6,
        name: "Honda"
    },
    {
        id: 7,
        name: "Chevrolet"
    },
    {
        id: 8,
        name: "Nissan"
    },
    {
        id: 9,
        name: "Mercedes-Benz"
    },
    {
        id: 10,
        name: "Tesla"
    },
    {
        id: 11,
        name: "KJaguar-Land-Roveria"
    },
    {
        id: 12,
        name: "Kia"
    },
    {
        id: 13,
        name: "Mahindra"
    },
    {
        id: 14,
        name: "Koenigsegg"
    },
    {
        id: 15,
        name: "New_Temprory"
    },
]

const Pricing = [
    {
        id: 1,
        amount: '1000$'
    },
    {
        id: 2,
        amount: '2000$'
    },
    {
        id: 3,
        amount: '5000$'
    },
    {
        id: 5,
        amount: '10000$'
    },
    {
        id: 6,
        amount: '20000$'
    },
    {
        id: 7,
        amount: '30000$'
    },
    {
        id: 8,
        amount: '40000$'
    },
    {
        id: 9,
        amount: '50000$'
    },
    {
        id: 10,
        amount: '70000$'
    },
    {
        id: 11,
        amount: '80000$'
    },
    {
        id: 12,
        amount: '90000$'
    },
    {
        id: 13,
        amount: '100000$'
    },
    {
        id: 14,
        amount: '150000$'
    },
    {
        id: 15,
        amount: '1050000$'
    },
    {
        id: 14,
        amount: '5500000$'
    },
]

const Category= [
    {
        id: 1,
        name:'SUV',
        icon:'/suv-car.png'
    },
    // {
    //     id: 2,
    //     name:'Sports-car',
    //     icon:'/sports-car.png'
    // },
    {
        id: 2,
        name:'Sedan',
        icon:'/sedan.png'
    },
    {
        id: 3,
        name:'Hatchback',
        icon:'/hatchback.png'
    },
    {
        id: 4,
        name:'Off-road',
        icon:'/adventure.png'
    },
    {
        id: 5,
        name:'Electric',
        // icon:'/electric-car.png'
        icon:'/charging-station.png'
    },
    {
        id: 6,
        name:'Convertible',
        icon:'/convertible.png'
    },
    {
        id: 7,
        name:'Sports',
        icon:'/sports-car.png'
    },
    {
        id: 8,
        name:'Hybrid',
        icon:'/hybrid-car.png'
    },
    {
        id: 9,
        name:'Van',
        icon:'/van.png'
    },
    {
        id: 10,
        name:'Truck',
        icon:'/big-truck.png'
    },
    
]

export default {
    Type,
    Condition,
    CarMakes,
    Pricing,
    Category
}