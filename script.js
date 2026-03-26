use LaCapsule

db.coffees.insertMany([
    {
        name_coffee: "Moka",
        price_coffee: 3,
        origin_coffee: "Éthiopie",
        type_coffee : "arabica",
        is_deca: false,
    },

    {
        name_coffee: "Degustation",
        price_coffee: 4,
        origin_coffee: "Costa-rica",
        type_coffee : "robusta",
        is_deca: false,
    },
    {
        name_coffee: "L'original",
        price_coffee: 4,
        origin_coffee: "Brésil",
        type_coffee : "arabica",
        is_deca: false,
    },
    {
        name_coffee: "Déca",
        price_coffee: 4,
        origin_coffee: "Costa-rica",
        type_coffee : "assemblage",
        is_deca: true,
    },
])

db.milks.insertMany([
    {
        name_milk: "lait de vache",
        price_milk: 0.10,
        type_milk: "animal",
    },
    {
        name_milk: "lait de soja",
        price_milk: 0.50,
        type_milk: "vegetal",
    },
    {
        name_milk: "lait d'amande",
        price_milk: 0.50,
        type_milk: "vegetal",
    },
    {
        name_milk: "lait d'avoine'",
        price_milk: 0.50,
        type_milk: "vegetal",
    },
    {
        name_milk: "lait de chevre",
        price_milk: 0.30,
        type_milk: "animal",
    },

])

db.toppings.insertMany([
    {
        name_topping: "cannelle",
        price_topping: 0.30,
    },
    {
        name_topping: "caramel",
        price_topping: 0.10,
    },
    {
        name_topping: "chantilly",
        price_topping: 0.50,
    },
    {
        name_topping: "chocolat",
        price_topping: 0.20,
    },
    {
        name_topping: "vanille",
        price_topping: 0.20,
    },

])

db.sizes.insertMany([
    {
        coffee_size: "small",
        size_price: 3.90,
    },
    {
        coffee_size: "medium",
        size_price: 5.90,
    },
    {
        coffee_size: "large",
        size_price: 9.90,
    },
])
