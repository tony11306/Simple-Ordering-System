from flask import jsonify, abort
from flask.helpers import make_response
from flask_restful import Resource, reqparse
import json
import numbers

class DeleteMenu(Resource):
    def __init__(self):
        self.reqparse_args = reqparse.RequestParser()
        self.reqparse_args.add_argument('mealName', type=str, required=True, location='json')
        super().__init__()

    def post(self):
        args = self.reqparse_args.parse_args()
        meal_name = args['mealName']
        with open('./database/food_ingredient_info.json', 'r', encoding='utf-8') as f:
            foods = json.load(f)
        
        if meal_name not in foods:
            abort(400, "餐點不存在")
        del foods[meal_name]

        with open('./database/food_ingredient_info.json', 'w', encoding='utf-8') as f:
            f.write(json.dumps(foods, ensure_ascii=False))
        
        return jsonify({'message': '刪除成功'})


class AddMenu(Resource):
    def __init__(self):
        self.reqparse_args = reqparse.RequestParser()
        self.reqparse_args.add_argument('mealName', type=str, required=True, location='json')
        self.reqparse_args.add_argument('mealPrice', type=int, required=True, location='json')
        self.reqparse_args.add_argument('ingredients', type=dict[str, int], required=True, location='json')
        super().__init__()

    def post(self):
        args = self.reqparse_args.parse_args()
        meal_name = args['mealName']
        meal_price = args['mealPrice']
        ingredients = args['ingredients']
        with open('./database/food_ingredient_info.json', 'r', encoding='utf-8') as f:
            foods = json.load(f)

        if meal_name in foods:
            abort(400, "餐點已存在")
        
        if not isinstance(meal_price, numbers.Number):
            abort(400, "價格必須為數字")
        
        if not isinstance(ingredients, dict):
            abort(400, "食材必須為字典")
        
        for ingredient in ingredients:
            ingredients[ingredient] = int(ingredients[ingredient])
        
        foods[meal_name] = {
            "價格": meal_price,
            "食材": ingredients
        }

        with open('./database/food_ingredient_info.json', 'w', encoding='utf-8') as f:
            f.write(json.dumps(foods, ensure_ascii=False))
        
        return jsonify({'message': '新增成功'})

class Menu(Resource):

    def __init__(self):
        self.reqparse_args = reqparse.RequestParser()
        super().__init__()

    def get(self):
        with open('./database/food_ingredient_info.json', 'r', encoding='utf-8') as f:
            foods = json.load(f)
        
        menu = []
        for food in foods:
            menu.append({
                '餐點名稱': food,
                '價格': foods[food]["價格"]
            })
        
        return jsonify({'menu': menu})