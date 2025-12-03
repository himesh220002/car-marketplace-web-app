
type descrip = {
    carDetail?: any;
};


function Description({ carDetail }: descrip) {
    return (

        <div>
            {carDetail?.description ?
                <div className='p-4 md:p-6 xl:p-10 rounded-xl bg-white shadow-md mt-6 border'>
                    <h2 className='my-2 font-medium text-2xl'>Description</h2>
                    <p>{carDetail?.description}</p>
                </div>
                :
                <div className='mt-6 w-full rounded-xl h-[100px] bg-slate-200 animate-pulse'>


                </div>}
        </div>

    )
}

export default Description