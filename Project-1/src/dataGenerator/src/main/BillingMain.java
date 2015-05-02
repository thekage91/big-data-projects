package dataGenerator.src.main;

import java.io.IOException;

import dataGenerator.src.util.ItemBillingGenerator;

public class BillingMain {
	
public static void main(String[] args) throws IOException {
		
		// Comando da usare per generare il dataset
		
		// prima bisogna configurare il generatore di scontrini
		/* al costruttore va passato un file che contiene in chiaro la lista di
		 * cibi da cui pescare
		 * 
		 * tale file è nella cartella billing
		 * il file food pu� tranquillamente essere editato aggiungendo nuovi
		 * cibi (uno per riga)
		 */

		ItemBillingGenerator IB = new ItemBillingGenerator("/home/ugo/git/big-data-projects/Project-1/src/dataGenerator/src/main/data/foods.txt");
		
		/* quindi bisogna richiamare la funzione generate in cui bisogna passare:
		 * - il nome del file in cui generare il dataset
		 * - il numero di righe del file (nell'esempio 10)
		 * - il numero massimo di cibi per scontrino (nell'esempio 5)
		 * - la data viene generata in modo randomico nel formato yyyy-mm-dd
		 */
		IB.generate("/home/ugo/git/big-data-projects/Project-1/src/dataGenerator/src/main/data/esempio30righe.txt", 30, 5);
		IB.generate("/home/ugo/git/big-data-projects/Project-1/src/dataGenerator/src/main/data/esempio100righe.txt", 100, 7);
		IB.generate("/home/ugo/git/big-data-projects/Project-1/src/dataGenerator/src/main/data/esempio10000righe.txt", 10000, 9);
		IB.generate("/home/ugo/git/big-data-projects/Project-1/src/dataGenerator/src/main/data/esempio1000000righe.txt", 1000000, 11);

	}

}
