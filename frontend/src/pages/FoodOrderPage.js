import React, {useState, useEffect, Fragment} from 'react'
import { useNavigate, usePrompt } from "react-router-dom"

function FoodItem({foodName, price, onNumberEdit}) {
    const [number, setNumber] = useState(0)

    useEffect(() => {
        onNumberEdit(foodName, number)
    }, [number])

    return (
        <div className='card'>
            <p className='large-text'>{foodName}</p>
            <p>{price}$</p>
            <p>
                <button className='btn-1' onClick={() => setNumber(number > 0 ? number - 1 : 0)}>-</button>
                {number}
                <button className='btn-1' onClick={() => setNumber(number + 1)}>+</button>
                份
            </p>
        </div>
    )
}

export default function FoodOrderPage() {
    const [menu, setMenu] = useState([])
    const [order, setOrder] = useState({})
    const [totalPrice, setTotalPrice] = useState(0)
    const navigate = useNavigate()

    const caclTotalPrice = (order) => {
        let total = 0
        for (let key in order) {
            total += order[key] * menu.find(item => item.餐點名稱 === key).價格
        }
        return total
    }

    const onEditOrder = (foodName, number) => {
        if(number === 0) {
            delete order[foodName]
        } else {
            order[foodName] = number
        }
        setOrder(order)
        setTotalPrice(caclTotalPrice(order))
    }

    useEffect(() => {
        fetch('/menu').then(res => res.json()).then(data => {
            setMenu(data['menu'])
        })
    }, [])

    const onSendOrder = () => {
        if(Object.keys(order).length === 0) {
            alert('請選擇餐點')
            return
        }
        fetch('/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                order: order
            })
        }).then(res => res.json()).then(data => {
            
            alert(data['message'])
            if(data.message === '訂購成功') {
                navigate('/')
            }
        })
    }

    return(
        <Fragment>
        <div className="product">
            {menu.map(item => <FoodItem key={item.餐點名稱} foodName={item.餐點名稱} price={item.價格} onNumberEdit={onEditOrder}/>)}
        </div>
        <div className='stick-bottom irony-bg'>
            <p className='large-text black-text'>總價: {totalPrice}$</p>
            <button className='btn-2' onClick={() => onSendOrder()}>送出訂單</button>
        </div>
        </Fragment>
    )
}