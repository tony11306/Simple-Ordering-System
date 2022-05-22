from flask import jsonify, abort
from flask.helpers import make_response
from flask_restful import Resource, reqparse
import json



class EditIngredientStock(Resource):

    def __init__(self):
        self.reqparse_args = reqparse.RequestParser()
        self.reqparse_args.add_argument('ingredient', type=str, required=True)
        self.reqparse_args.add_argument('stock', type=int, required=True)
        self.reqparse_args.add_argument('cost', type=int, required=True)
        super().__init__()

    def post(self):
        args = self.reqparse_args.parse_args()
        ingredient = args['ingredient']
        stock = args['stock']
        cost = args['cost']

        if stock < 0:
            abort(400, "庫存不能小於 0")
        
        if cost < 0:
            abort(400, "成本不能小於 0")

        with open('./database/ingredient_stock.json', 'r', encoding='utf-8') as f:
            ingredients = json.load(f)

        if ingredient not in ingredients:
            abort(404, '食材不存在')
        
        ingredients[ingredient]['庫存'] = stock
        ingredients[ingredient]['成本'] = cost

        with open('./database/ingredient_stock.json', 'w', encoding='utf-8') as f:
            json.dump(ingredients, f, ensure_ascii=False, indent=4)

        return jsonify({'message': '修改成功'})

class IngredientStock(Resource):

    def __init__(self):
        self.reqparse_args = reqparse.RequestParser()
        self.reqparse_args.add_argument('ingredient', type=str, required=False)
        super().__init__()

    def get(self):
        with open('./database/ingredient_stock.json', 'r', encoding='utf-8') as f:
            ingredients = json.load(f)

        ingredient = self.reqparse_args.parse_args()['ingredient']

        if not ingredient:
            return jsonify(ingredients)
        
        if ingredient not in ingredients:
            abort(404, "食材不存在")
        
        return jsonify({ingredient: ingredients[ingredient]})

class DeleteIngredient(Resource):
    def __init__(self):
        self.reqparse_args = reqparse.RequestParser()
        self.reqparse_args.add_argument('ingredient', type=str, required=True)
        super().__init__()

    def _is_ingredient_required_in_food_ingredient_info(self, ingredient):
        with open('./database/food_ingredient_info.json', 'r', encoding='utf-8') as f:
            foods = json.load(f)

        for food in foods:
            if ingredient in foods[food]['食材']:
                return True
        return False
    
    def post(self):
        args = self.reqparse_args.parse_args()
        ingredient = args['ingredient']
        with open('./database/ingredient_stock.json', 'r', encoding='utf-8') as f:
            ingredients = json.load(f)
        
        if ingredient not in ingredients:
            abort(400, "食材不存在")
        if self._is_ingredient_required_in_food_ingredient_info(ingredient):
            abort(400, "現有食材不可刪除")

        del ingredients[ingredient]

        with open('./database/ingredient_stock.json', 'w', encoding='utf-8') as f:
            f.write(json.dumps(ingredients, ensure_ascii=False))
        
        return jsonify({'message': '刪除成功'})

class AddIngredient(Resource):
    
        def __init__(self):
            self.reqparse_args = reqparse.RequestParser()
            self.reqparse_args.add_argument('ingredient', type=str, required=True)
            self.reqparse_args.add_argument('stock', type=int, required=True)
            self.reqparse_args.add_argument('cost', type=int, required=True)
            super().__init__()
    
        def post(self):
            args = self.reqparse_args.parse_args()
            ingredient = args['ingredient']
            stock = args['stock']
            cost = args['cost']

            if ingredient == '':
                abort(400, '食材名稱不可為空白')
            
            if stock < 0:
                abort(400, '庫存不可為負數')
            
            if cost < 0:
                abort(400, '成本不可為負數')
    
            with open('./database/ingredient_stock.json', 'r', encoding='utf-8') as f:
                ingredients = json.load(f)
    
            if ingredient in ingredients:
                abort(400, "食材已存在")
            
            ingredients[ingredient] = {'庫存': stock, '成本': cost}
    
            with open('./database/ingredient_stock.json', 'w', encoding='utf-8') as f:
                json.dump(ingredients, f, ensure_ascii=False, indent=4)
    
            return jsonify({'message': '新增成功'})

class Ingredients(Resource):

    def __init__(self):
        self.reqparse_args = reqparse.RequestParser()
        super().__init__()

    def get(self):
        with open('./database/ingredient_stock.json', 'r', encoding='utf-8') as f:
            ingredients = json.load(f)
        
        # get all keys from ingredients
        keys = ingredients.keys()

        return jsonify({'ingredients': list(keys)})