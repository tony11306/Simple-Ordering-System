import React, {useState, useEffect, Fragment} from 'react'
import { useNavigate, usePrompt } from "react-router-dom"

function IngredientItem({ingredient, cost, stock, onEdit}) {

    const [isEditing, setIsEditing] = useState(false)
    const [newCost, setNewCost] = useState(cost)
    const [newStock, setNewStock] = useState(stock)

    const onDelete = () => {

        fetch('/ingredients/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ingredient: ingredient
            })
        }).then(res => res.json()).then(data => {
            alert(data['message'])
            if(data.message === '刪除成功') {
                onEdit()
            }
        })
    }

    const onStore = () => {
        fetch('/ingredients/stock/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ingredient: ingredient,
                stock: newStock,
                cost: newCost
            })
        }).then(res => res.json()).then(data => {
            alert(data['message'])
            if(data.message === '修改成功') {
                setIsEditing(false)
                onEdit()
            }
        }) 
    }

    return (
        <div className='row'>
            <p>{ingredient}</p>
            {
                isEditing ?
                <Fragment>
                    <input onChange={e => setNewStock(e.target.value)} defaultValue={stock}></input>
                    <input onChange={e => setNewCost(e.target.value)} defaultValue={cost}></input>
                </Fragment> 
                :
                <Fragment>
                    <p>剩餘 {stock} 單位</p>
                    <p>單位成本 {cost}</p>
                </Fragment>
            }
            <div className='row'>
                {
                    isEditing ? 
                    <Fragment>
                        <button className='btn-2' onClick={() => onStore()}>儲存</button>
                        <button className='btn-2' onClick={() => setIsEditing(false)}>取消</button>
                        <button className='btn-2' onClick={() => onDelete()}>移除</button>
                    </Fragment>
                    :
                    <button className='btn-2' onClick={() => setIsEditing(true)}>編輯</button>
                }
            </div>
        </div>
    )
}

export default function IngredientManagementPage() {

    const [ingredients, setIngredients] = useState({})
    const [ingredientName, setIngredientName] = useState('')
    const [ingredientCost, setIngredientCost] = useState(0)
    const [ingredientStock, setIngredientStock] = useState(0)

    useEffect(() => {
        fetch('/ingredients/stock').then(res => res.json()).then(data => {
            setIngredients(data)
        })
    }, [])

    const onEdit = () => {
        fetch('/ingredients/stock').then(res => res.json()).then(data => {
            setIngredients(data)
        })
    }

    const onAddIngredient = () => {
        if(ingredientName === '') {
            alert('請輸入食材名稱')
            return
        }
        if(ingredientCost < 0) {
            alert('請輸入食材價格')
            return
        }
        if(ingredientStock < 0) {
            alert('請輸入食材庫存')
            return
        }

        fetch('/ingredients/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ingredient: ingredientName,
                cost: ingredientCost,
                stock: ingredientStock
            })
        }).then(res => res.json()).then(data => {
            alert(data['message'])
            fetch('/ingredients/stock').then(res => res.json()).then(data => {
                setIngredients(data)
            })

        })
    }

    return (
        <div className='card'>
            <h2>食材管理</h2>
            <div className='rows min-width-80'>
                {
                    Object.keys(ingredients).map(key => <IngredientItem key={key} ingredient={key} cost={ingredients[key].成本} stock={ingredients[key].庫存} onEdit={onEdit}/>)
                }
                
            </div>

            <div className='card min-width-80'>
                    <label htmlFor='ingredientName'>新增食材名稱</label>
                    <input placeholder='Ex: 西瓜' id='ingredientName' onChange={e => setIngredientName(e.target.value)}/>
                    <label htmlFor='ingredientStock'>新增食材庫存</label>
                    <input placeholder='Ex: 201' id='ingredientStock' onChange={e => setIngredientCost(e.target.value)}/>
                    <label htmlFor='ingredientCost'>新增單位食材成本</label>
                    <input placeholder='Ex: 10' id='ingredientCost' onChange={e => setIngredientStock(e.target.value)}/>

                <button className='btn-2' onClick={() => onAddIngredient()}>新增食材</button>
            </div>
            
        </div>
    )
}