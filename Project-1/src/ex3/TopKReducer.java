package ex3;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;


public class TopKReducer extends Reducer<Text,IntWritable,Text,IntWritable>   {

	private static final int TOP_K = 10;

	private PriorityQueue<SaleLine> queue;

	/* Crea la coda dove andranno inserite le prime 10 coppie */
	protected void setup(Context ctx) {
		queue = new PriorityQueue<SaleLine>(TOP_K, new Comparator<SaleLine>() {
			public int compare(SaleLine p1, SaleLine p2) {
				return p1.count.compareTo(p2.count);
			}
		});
	}

	/* Fa la somma ed inserisce nella coda */ 
	protected void reduce(Text key, Iterable<IntWritable> values, 
			Context ctx) throws IOException, InterruptedException {

		int count = 0;
		for (IntWritable value : values) {
			count = count + value.get();
		}
		queue.add(new SaleLine(key.toString(), count));
		if (queue.size() > TOP_K) {
			queue.remove();
		}
	}

	/* estrae i primi 10 elementi dalla coda */
	protected void cleanup(Context ctx) 
			throws IOException, InterruptedException {

		List<SaleLine> topKPairs = new ArrayList<SaleLine>();
		while (! queue.isEmpty()) {
			topKPairs.add(queue.remove());
		}
		for (int i = topKPairs.size() - 1; i >= 0; i--) {
			SaleLine topKPair = topKPairs.get(i);
			/* count sarebbe quante coppie (X,Y) ci sono */
			ctx.write(new Text(topKPair.str), 
					new IntWritable(topKPair.count));
		}
	}	    
}
