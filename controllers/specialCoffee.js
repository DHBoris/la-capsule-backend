const specialCoffeeModel = require("../models/specialCoffee");

module.exports = {
    create: async (req, res) => {
        try {

            console.log(req.body);

            const formData = req.body;


            const specialCoffee = new specialCoffeeModel(formData);


            await specialCoffee.save();


            res.status(200).json({ message: 'Données du formulaire specialCoffee enregistrées avec succès' });
          } catch (error) {
            console.error(error);

            res.status(500).json({ error: 'Une erreur est survenue lors de l\'enregistrement des données du formulaire specialCoffee' });
          }
    },
}
