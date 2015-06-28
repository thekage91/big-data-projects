package ex4;

import java.io.IOException;
import java.util.Iterator;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.*;

public class ExerciseAFirstMapper extends Mapper<LongWritable, Text, Text, IntWritable> {

	private final static IntWritable one = new IntWritable(1); 
	private String [] products;
	
	@Override
	public void map(LongWritable key, Text line,
			Context context)
			throws IOException, InterruptedException {
		// TODO Auto-generated method stub
		products = line.toString().split(",");
	 	for(int i = 1; i < products.length; i++) 
			for(int j = 1; j < products.length; j++)
				context.write(new Text(products[i]+"\t"+products[j]),one );
	 	
		}
		
		
	}


