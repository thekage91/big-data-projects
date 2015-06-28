package ex5;


import java.io.IOException;
import java.util.*;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Mapper.Context;


public class Ex5Mapper  extends Mapper<LongWritable, Text, Text, IntWritable> {
	
	private Text word1 = new Text();
	private Text word2 = new Text();

	public void map(LongWritable key, Text value,
			Context context)
			throws IOException, InterruptedException {

		String line = value.toString();
		String[] lineTokenized = line.split(",");
		String[] words = line.split(",");
		
		/* Genero tutti i possibili accoppiamenti da due elementi */ 
		this.generatePair(lineTokenized, words, context);
		
		/* Genero tutti i possibili accoppiamenti da tre elementi */ 
		this.generatePair(lineTokenized, words, context);
		
		/* Genero tutti i possibili accoppiamenti da quattro elementi */ 
		this.generatePair(lineTokenized, words, context);
		
		/* Genero tutti i possibili accoppiamenti da cinque elementi */ 
		this.generatePair(lineTokenized, words, context);
		
	}
	
	private void generatePair(String[] lineTokenized, String[] words, Context context) throws IOException, InterruptedException{
		
		for(int i = 1; i < words.length; i++){
			for(int j = 1; j < lineTokenized.length; j++){
			
				if(!words[i].contains(lineTokenized[j]) && i < j){
					
					words[i] += "," + lineTokenized[j];		
					context.write(new Text(words[i]), new IntWritable(1));
				}
			}
		}
	}
}
