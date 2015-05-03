package ex5;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.Reducer.Context;

import ex3.SaleLine;

public class Ex5Reducer  extends Reducer<Text, IntWritable, Text, DoubleWritable>{

	private PriorityQueue<SaleLine> queue;

	@Override
	protected void setup(Context ctx) {

		queue = new PriorityQueue<SaleLine>(new Comparator<SaleLine>() {
			public int compare(SaleLine s1, SaleLine s2) {
				return s1.count.compareTo(s2.count);
			}
		});
	}

	@Override
	protected void reduce(Text key, Iterable<IntWritable> values, 
			Context ctx) throws IOException, InterruptedException {

		int sum = 0;

		for (IntWritable value : values) {
			sum = sum + value.get();
		}

		queue.add(new SaleLine(key.toString(), sum));
	}

	@Override
	protected void cleanup(Context ctx) 
			throws IOException, InterruptedException {

		for (SaleLine elem : queue) {
			ctx.write(new Text(elem.str), new DoubleWritable(elem.count));
		}
	}
}
