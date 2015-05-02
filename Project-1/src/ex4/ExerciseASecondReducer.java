package ex4;

import java.io.IOException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.mapreduce.Reducer.Context;

import ex2.SecondStepMapper;

public class Association2ndReducer extends Reducer<Text, Text, Text, Text>{

	private IntWritable result = new IntWritable();
	public static final Log LOG = LogFactory.getLog(Association2ndReducer.class);

	@Override
	public void reduce(Text key, Iterable<Text> values,
			Context context
			) throws IOException, InterruptedException {
		int total=0;
		int current=0;
		String product;
		List<String> cache = new ArrayList<String>();
		DecimalFormat df = new DecimalFormat("#.##");
		
		for (Text val : values) {
			cache.add(val.toString());
			product = val.toString().split("\\s+")[0];
			if(product.equals("total"))
				total = Integer.parseInt(val.toString().split("\\s+")[1]);
		}
		
		
		context.write(new Text("Tot. transactions of "+key+": "), new Text(""+total) );
	
		for (String val : cache) {
			product = val.split("\\s+")[0];
			if(!product.equals("total")) {	
				current = Integer.parseInt(val.toString().split("\\s+")[1]);
				context.write(new Text(key + " -> " + product + ": "), new Text(df.format((double)current/(double)total)));
			}
		}
		

	}

}
