package ex2;


import java.io.IOException;
import java.util.NoSuchElementException;
import java.util.StringTokenizer;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapred.MapReduceBase;
import org.apache.hadoop.mapred.Mapper;
import org.apache.hadoop.mapred.OutputCollector;
import org.apache.hadoop.mapred.Reporter;

public class StatisticMapper extends MapReduceBase implements Mapper<LongWritable, Text, Text, IntWritable> {
	private final static IntWritable one = new IntWritable(1); 
	private Text word = new Text();
	
	@Override
	public void map(LongWritable arg0, Text in,
			OutputCollector<Text, IntWritable> output, Reporter arg3)
					throws IOException {
		Text toWrite;
		boolean first=true;
		String line = in.toString();
		StringTokenizer tokenizer = new StringTokenizer(line);
		
		word.set(tokenizer.nextToken(","));
		
		String [] aaaammgg = word.toString().split("-");
		String anno = aaaammgg[0];
		String mese = aaaammgg[1];
		
		if( !anno.equals("2015") 
			|| Integer.parseInt(mese) > 3)
		return;		
		
		try {
		while (true) {
			word.set(tokenizer.nextToken(","));
			toWrite = new Text(word.toString()+" "+mese+ "/"+anno);
			output.collect(toWrite, one);
		}
	
		} catch(NoSuchElementException e) {
			return;
		}
		// TODO Auto-generated method stub

	}

}
