package util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Random;

public class FoodGenerator {
	
	private ArrayList<String> foods;
	
	public FoodGenerator(String fileName) throws IOException{
		this.foods = new ArrayList<String>();
		File name = new File(fileName);
		if (name.isFile()) {
			try {
				BufferedReader input = new BufferedReader(new FileReader(name));
				String text;
				while ((text = input.readLine()) != null)
					foods.add(text);
				input.close();
			} catch (IOException ioException) {
				ioException.printStackTrace();
			}
		}	
		
	}
	
	public String getSingleFood(){
		int index = new Random().nextInt(this.foods.size());
        String single_food = this.foods.get(index);
        return single_food;
	}
	
	public String getMutipleInterest(int n){
		String multiple_foods = "";
		HashSet<String> hs = new HashSet<String>();
		for (int i = 0; i<n; i++)	
			hs.add(getSingleFood());
		for (String text: hs)
             multiple_foods = multiple_foods + "," + text;

        return multiple_foods;
	}

}
