export interface FoodItem {
  id: string;
  name: string;
  category: "protein" | "grains" | "vegetables" | "legumes" | "fruits" | "nuts" | "dairy" | "other";
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  plantBased: boolean;
}

export interface MealSuggestion {
  id: string;
  name: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  ingredients: string[];
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  plantBased: boolean;
}

export interface NutritionState {
  foods: FoodItem[];
  mealSuggestions: MealSuggestion[];
  mealLogs: MealLog[];
  nutritionGoals: NutritionGoals;
}

export interface MealLog {
  id: string;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  foodIds: string[];
}

export interface NutritionGoals {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function seedFoods(): FoodItem[] {
  return [
    { id: "tofu", name: "Tofu (firm)", category: "protein", kcal: 76, protein: 8, carbs: 1.9, fat: 4.8, servingSize: "100g", plantBased: true },
    { id: "tempeh", name: "Tempeh", category: "protein", kcal: 193, protein: 19, carbs: 9.4, fat: 10.8, servingSize: "100g", plantBased: true },
    { id: "seitan", name: "Seitan (wheat gluten)", category: "protein", kcal: 120, protein: 24, carbs: 6, fat: 1.5, servingSize: "100g", plantBased: true },
    { id: "lentils", name: "Lentils (cooked)", category: "legumes", kcal: 116, protein: 9, carbs: 20, fat: 0.4, servingSize: "100g", plantBased: true },
    { id: "chickpeas", name: "Chickpeas (cooked)", category: "legumes", kcal: 139, protein: 7.6, carbs: 22.5, fat: 2.6, servingSize: "100g", plantBased: true },
    { id: "black-beans", name: "Black Beans (cooked)", category: "legumes", kcal: 132, protein: 8.9, carbs: 23.7, fat: 0.5, servingSize: "100g", plantBased: true },
    { id: "edamame", name: "Edamame (shelled)", category: "legumes", kcal: 122, protein: 12, carbs: 8.9, fat: 5, servingSize: "100g", plantBased: true },
    { id: "quinoa", name: "Quinoa (cooked)", category: "grains", kcal: 120, protein: 4.4, carbs: 21.3, fat: 1.9, servingSize: "100g", plantBased: true },
    { id: "brown-rice", name: "Brown Rice (cooked)", category: "grains", kcal: 111, protein: 2.6, carbs: 23, fat: 0.9, servingSize: "100g", plantBased: true },
    { id: "oats", name: "Rolled Oats", category: "grains", kcal: 66, protein: 2.4, carbs: 11.5, fat: 1.1, servingSize: "40g dry", plantBased: true },
    { id: "whole-wheat-pasta", name: "Whole Wheat Pasta (cooked)", category: "grains", kcal: 124, protein: 5.3, carbs: 26, fat: 0.5, servingSize: "100g", plantBased: true },
    { id: "sweet-potato", name: "Sweet Potato (baked)", category: "vegetables", kcal: 90, protein: 2, carbs: 20.7, fat: 0.1, servingSize: "100g", plantBased: true },
    { id: "broccoli", name: "Broccoli (steamed)", category: "vegetables", kcal: 35, protein: 2.4, carbs: 7.2, fat: 0.4, servingSize: "100g", plantBased: true },
    { id: "spinach", name: "Spinach (raw)", category: "vegetables", kcal: 23, protein: 2.9, carbs: 3.6, fat: 0.4, servingSize: "100g", plantBased: true },
    { id: "kale", name: "Kale", category: "vegetables", kcal: 49, protein: 4.3, carbs: 8.8, fat: 0.9, servingSize: "100g", plantBased: true },
    { id: "banana", name: "Banana", category: "fruits", kcal: 89, protein: 1.1, carbs: 22.8, fat: 0.3, servingSize: "medium (118g)", plantBased: true },
    { id: "blueberries", name: "Blueberries", category: "fruits", kcal: 57, protein: 0.7, carbs: 14.5, fat: 0.3, servingSize: "100g", plantBased: true },
    { id: "apple", name: "Apple", category: "fruits", kcal: 52, protein: 0.3, carbs: 14, fat: 0.2, servingSize: "medium (182g)", plantBased: true },
    { id: "avocado", name: "Avocado", category: "fruits", kcal: 160, protein: 2, carbs: 8.5, fat: 14.7, servingSize: "half (100g)", plantBased: true },
    { id: "almonds", name: "Almonds", category: "nuts", kcal: 579, protein: 21, carbs: 22, fat: 50, servingSize: "30g (handful)", plantBased: true },
    { id: "walnuts", name: "Walnuts", category: "nuts", kcal: 654, protein: 15, carbs: 14, fat: 65, servingSize: "30g (handful)", plantBased: true },
    { id: "peanut-butter", name: "Peanut Butter", category: "nuts", kcal: 588, protein: 25, carbs: 20, fat: 50, servingSize: "2 tbsp (32g)", plantBased: true },
    { id: "chia-seeds", name: "Chia Seeds", category: "nuts", kcal: 486, protein: 17, carbs: 42, fat: 31, servingSize: "2 tbsp (28g)", plantBased: true },
    { id: "hemp-seeds", name: "Hemp Seeds", category: "nuts", kcal: 553, protein: 32, carbs: 9, fat: 49, servingSize: "3 tbsp (30g)", plantBased: true },
    { id: "greek-yogurt", name: "Greek Yogurt (plain)", category: "dairy", kcal: 59, protein: 10, carbs: 3.6, fat: 0.7, servingSize: "100g", plantBased: false },
    { id: "cottage-cheese", name: "Cottage Cheese", category: "dairy", kcal: 98, protein: 11, carbs: 3.4, fat: 4.3, servingSize: "100g", plantBased: false },
    { id: "eggs", name: "Eggs (whole)", category: "protein", kcal: 155, protein: 13, carbs: 1.1, fat: 11, servingSize: "2 large (100g)", plantBased: false },
    { id: "chicken-breast", name: "Chicken Breast (skinless)", category: "protein", kcal: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: "100g", plantBased: false },
    { id: "salmon", name: "Salmon (wild)", category: "protein", kcal: 182, protein: 25, carbs: 0, fat: 8.2, servingSize: "100g", plantBased: false },
    { id: "tuna", name: "Tuna (canned in water)", category: "protein", kcal: 116, protein: 26, carbs: 0, fat: 0.8, servingSize: "100g", plantBased: false },
    { id: "nutritional-yeast", name: "Nutritional Yeast", category: "other", kcal: 350, protein: 50, carbs: 35, fat: 5, servingSize: "2 tbsp (15g)", plantBased: true },
    { id: "olive-oil", name: "Olive Oil (extra virgin)", category: "other", kcal: 884, protein: 0, carbs: 0, fat: 100, servingSize: "1 tbsp (15ml)", plantBased: true },
    { id: "soy-milk", name: "Soy Milk (unsweetened)", category: "dairy", kcal: 33, protein: 2.9, carbs: 1.7, fat: 1.5, servingSize: "100ml", plantBased: true },
    { id: "almond-milk", name: "Almond Milk (unsweetened)", category: "dairy", kcal: 17, protein: 0.6, carbs: 0.5, fat: 1.5, servingSize: "100ml", plantBased: true },
  ];
}

export function seedMealSuggestions(): MealSuggestion[] {
  return [
    { id: "tofu-scramble", name: "Tofu Scramble on Whole Grain Toast", mealType: "breakfast", ingredients: ["firm tofu", "turmeric", "spinach", "whole grain bread"], kcal: 320, protein: 24, carbs: 28, fat: 14, plantBased: true },
    { id: "oatmeal-bowl", name: "Overnight Oats with Berries & Hemp Seeds", mealType: "breakfast", ingredients: ["rolled oats", "soy milk", "blueberries", "hemp seeds", "maple syrup"], kcal: 380, protein: 18, carbs: 48, fat: 14, plantBased: true },
    { id: "smoothie-bowl", name: "Green Smoothie Bowl", mealType: "breakfast", ingredients: ["banana", "spinach", "soy milk", "peanut butter", "chia seeds"], kcal: 350, protein: 16, carbs: 42, fat: 16, plantBased: true },
    { id: "yogurt-bowl", name: "Greek Yogurt Bowl", mealType: "breakfast", ingredients: ["greek yogurt", "granola", "blueberries", "almonds"], kcal: 340, protein: 28, carbs: 30, fat: 12, plantBased: false },
    { id: "lentil-bowl", name: "Lentil Buddha Bowl", mealType: "lunch", ingredients: ["lentils", "quinoa", "roasted sweet potato", "kale", "tahini dressing"], kcal: 450, protein: 22, carbs: 55, fat: 16, plantBased: true },
    { id: "chickpea-wrap", name: "Chickpea & Avocado Wrap", mealType: "lunch", ingredients: ["chickpeas", "avocado", "whole wheat wrap", "spinach", "lemon juice"], kcal: 420, protein: 16, carbs: 45, fat: 18, plantBased: true },
    { id: "tofu-bowl", name: "Teriyaki Tofu Rice Bowl", mealType: "lunch", ingredients: ["tofu", "brown rice", "broccoli", "edamame", "soy sauce"], kcal: 440, protein: 28, carbs: 50, fat: 14, plantBased: true },
    { id: "chicken-salad", name: "Grilled Chicken & Quinoa Salad", mealType: "lunch", ingredients: ["chicken breast", "quinoa", "avocado", "kale", "olive oil"], kcal: 460, protein: 38, carbs: 32, fat: 18, plantBased: false },
    { id: "chickpea-curry", name: "Chickpea & Spinach Curry", mealType: "dinner", ingredients: ["chickpeas", "spinach", "coconut milk", "brown rice", "curry spices"], kcal: 480, protein: 20, carbs: 55, fat: 20, plantBased: true },
    { id: "lentil-bolognese", name: "Lentil Bolognese", mealType: "dinner", ingredients: ["lentils", "whole wheat pasta", "tomato sauce", "nutritional yeast", "garlic"], kcal: 460, protein: 24, carbs: 60, fat: 10, plantBased: true },
    { id: "tofu-stirfry", name: "Tofu & Vegetable Stir-Fry", mealType: "dinner", ingredients: ["tofu", "broccoli", "bell peppers", "brown rice", "soy sauce"], kcal: 400, protein: 26, carbs: 48, fat: 12, plantBased: true },
    { id: "salmon-bowl", name: "Salmon with Sweet Potato & Broccoli", mealType: "dinner", ingredients: ["salmon", "sweet potato", "broccoli", "olive oil", "lemon"], kcal: 480, protein: 35, carbs: 35, fat: 18, plantBased: false },
    { id: "tempeh-bowl", name: "Tempeh & Quinoa Power Bowl", mealType: "dinner", ingredients: ["tempeh", "quinoa", "kale", "avocado", "tahini"], kcal: 500, protein: 30, carbs: 40, fat: 22, plantBased: true },
    { id: "hummus-plate", name: "Hummus & Veggie Plate", mealType: "snack", ingredients: ["chickpeas", "tahini", "carrot sticks", "cucumber", "whole grain crackers"], kcal: 280, protein: 14, carbs: 30, fat: 14, plantBased: true },
    { id: "apple-butter", name: "Apple Slices with Peanut Butter", mealType: "snack", ingredients: ["apple", "peanut butter"], kcal: 250, protein: 10, carbs: 28, fat: 14, plantBased: true },
    { id: "trail-mix", name: "Trail Mix", mealType: "snack", ingredients: ["almonds", "walnuts", "dark chocolate chips", "dried cranberries"], kcal: 220, protein: 8, carbs: 20, fat: 14, plantBased: true },
  ];
}

export function seedNutritionState(): NutritionState {
  return {
    foods: seedFoods(),
    mealSuggestions: seedMealSuggestions(),
    mealLogs: [],
    nutritionGoals: { kcal: 1800, protein: 90, carbs: 200, fat: 60 },
  };
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}
