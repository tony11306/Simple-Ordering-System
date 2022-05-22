import React, {useState, useEffect, Fragment} from 'react'
import { useNavigate } from "react-router-dom"

export default function MenuDeletePage() {

    const [deleteFoodName, setDeleteFoodName] = useState('')
    const [foodList, setFoodList] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        fetch('/menu').then(res => res.json()).then(data => {
            setFoodList(data['menu'].map(item => item.餐點名稱))
        })
    }, [])

    useEffect(() => {
        setDeleteFoodName(foodList[0])
    }, [foodList])

    const onSubmit = () => {
        if(deleteFoodName === '') {
            alert('請選擇餐點名稱')
            return
        }

        fetch('/menu/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mealName: deleteFoodName
            })
        }).then(res => res.json()).then(data => {
            if(data['message'] === '刪除成功') {
                alert('刪除成功')
                navigate('/')
            }
        })
    }


    return (
        <div className='card'>
            <label className='large-text' htmlFor='delete-selection'>選擇刪除的餐點</label>
            <select id='delete-selection' value={deleteFoodName} onChange={e => setDeleteFoodName(e.target.value)}>
                {foodList.map(item => (
                    <option key={item} value={item}>{item}</option>
                ))}
            </select>
            
            <button className='btn-2' onClick={() => onSubmit()}>刪除</button>

        </div>
    )
}