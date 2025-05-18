import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'

// ✅ Format numbers with commas based on currency
const formatPrice = (price: number, currency: 'usd' | 'inr') => {
    return new Intl.NumberFormat(currency === 'inr' ? 'en-IN' : 'en-US').format(price)
}

function FinancialCalculator({ carDetail }) {
    const [currency, setCurrency] = useState<'usd' | 'inr'>('usd')
    const exchangeRate = 85 // 1 USD = ₹85

    const [carPrice, setCarPrice] = useState(0);
    const [interestRate, setInterestRate] = useState(0)
    const [loanTerm, setLoanTerm] = useState(0)
    const [downPayment, setDownPayment] = useState(0)
    const [monthlyPayment, setMonthlyPayment] = useState(0)

    // 🔁 Currency toggle and live conversion
    const handleCurrencyToggle = () => {
        const convert = (val: number) =>
            currency === 'usd' ? val * exchangeRate : val / exchangeRate

        setCarPrice(convert(carPrice))
        setDownPayment(convert(downPayment))
        setMonthlyPayment(convert(monthlyPayment))
        setCurrency(currency === 'usd' ? 'inr' : 'usd')
    }

    // 💰 Monthly EMI calculation
    const CalculateMonthlyPayment = () => {
        const principal = carPrice - downPayment
        const monthlyInterestRate = interestRate / 1200

        const monthly =
            (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm)) /
            (Math.pow(1 + monthlyInterestRate, loanTerm) - 1)

        setMonthlyPayment(Number(monthly.toFixed(2)))
    }

    return (
        <div className='p-10 border rounded-xl shadow-md mt-7'>
            <h2 className='font-medium text-2xl'>Financial Calculator</h2>

            <div className='flex gap-5 mt-5 items-end'>
                <div className='w-full'>
                    <div className='flex justify-between items-center'>
                        <label>
                            Price ({currency === 'usd' ? '$' : '₹'})
                        </label>
                        <Button size='sm' variant='outline' onClick={handleCurrencyToggle}>
                           Currency :  {currency === 'usd' ? '$' : '₹'}
                        </Button>
                    </div>
                    <Input
                        type='number'
                        value={carPrice}
                        onChange={(e) => setCarPrice(Number(e.target.value))}
                        onFocus={(e) => {
                            if (e.target.value === '0') e.target.value = ''
                        }}
                    />
                </div>

                <div className='w-full'>
                    <label>Interest Rate (%)</label>
                    <Input
                        className='mt-1'
                        type='number'
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        onFocus={(e) => {
                            if (e.target.value === '0') e.target.value = ''
                        }}
                    />
                </div>
            </div>

            <div className='flex gap-5 mt-5'>
                <div className='w-full'>
                    <label>Loan Term (Months)</label>
                    <Input
                        type='number'
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(Number(e.target.value))}
                        onFocus={(e) => {
                            if (e.target.value === '0') e.target.value = ''
                        }}
                    />
                </div>
                <div className='w-full'>
                    <label>Down Payment ({currency === 'usd' ? '$' : '₹'})</label>
                    <Input
                        type='number'
                        value={downPayment}
                        onChange={(e) => setDownPayment(Number(e.target.value))}
                        onFocus={(e) => {
                            if (e.target.value === '0') e.target.value = ''
                        }}
                    />
                </div>
            </div>

            {monthlyPayment > 0 && (
                <h2 className='font-medium text-2xl mt-5 text-center'>
                    Your Monthly Payment Is:{' '}
                    <span className='text-4xl font-bold'>
                        {currency === 'usd' ? '$' : '₹'}
                        {formatPrice(Math.ceil(monthlyPayment), currency)}
                    </span>
                </h2>
            )}

            <Button
                className='w-full mt-5 bg-blue-700'
                size='lg'
                onClick={CalculateMonthlyPayment}
            >
                Calculate
            </Button>
        </div>
    )
}

export default FinancialCalculator
